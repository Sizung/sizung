require 'test_helper'
require 'support/email'

describe Api::DeliverablesController do
  include Devise::TestHelpers
  include ActiveJob::TestHelper

  describe 'visitor' do
    it 'should not be allowed to create a new deliverable' do
      post :create, deliverable: {title: 'Next big thing'}
      assert_redirected_to new_user_session_path
    end
  end

  describe 'signed in' do
    setup do
      @conversation = FactoryGirl.create(:conversation)
      @request.env['devise.mapping'] = Devise.mappings[:user]
      @current_user = @conversation.organization.owner
      sign_in @current_user
      @agenda_item  = FactoryGirl.create(:agenda_item, conversation: @conversation, owner: @current_user)
      @deliverable = FactoryGirl.create(:deliverable, owner: @current_user, assignee: @current_user, parent: @agenda_item)
    end
    
    it 'creates deliverable' do
      expect {
        post :create, deliverable: { title: 'Another big thing', parent_id: @agenda_item.id }, format: :json
      }.must_change 'Deliverable.count'

      assert_response :success
      deliverable = JSON.parse(response.body)
      assert_equal 'Another big thing', deliverable['data']['attributes']['title']
      assert_equal @current_user.id, deliverable['data']['relationships']['owner']['data']['id']
    end

    it 'updates the deliverable' do
      patch :update, id: @deliverable.id, deliverable: { title: 'Changed title' }, format: :json

      assert_response :success
      deliverable = JSON.parse(response.body)
      assert_equal 'Changed title', deliverable['data']['attributes']['title']
    end

    it 'archive deliverable' do
      patch :update, id: @deliverable.id, deliverable: { archived: true }

      assert_response :success
      expect(@deliverable.reload).must_be :paranoia_destroyed?

      deliverable = JSON.parse(response.body)
      assert_equal true, deliverable['data']['attributes']['archived']
    end

    it 'should freeze archived deliverables' do
      patch :update, id: @deliverable.id, deliverable: { archived: true }
      expect {
        patch :update, id: @deliverable.id, deliverable: { title: 'changed title' }
      }.must_raise ActiveRecord::RecordNotFound
    end

    it 'removes the unseen objects when a deliverable gets archived' do
      conversation_member = FactoryGirl.create :conversation_member, conversation: @agenda_item.conversation
      post :create, deliverable: { title: 'Another big thing', parent_id: @agenda_item.id }, format: :json

      expect(conversation_member.member.unseen_objects.count).must_equal 1

      deliverable = Deliverable.find(JSON.parse(response.body)['data']['id'])
      patch :update, id: deliverable.id, deliverable: { archived: true }

      expect(conversation_member.member.reload.unseen_objects.count).must_equal 0
    end

    it 'handles unseen objects when a deliverable gets moved to another agenda item' do
      clear_enqueued_jobs
      conversation_member = FactoryGirl.create :conversation_member, conversation: @agenda_item.conversation
      other_agenda_item = FactoryGirl.create :agenda_item, conversation: @agenda_item.conversation

      post :create, deliverable: { title: 'Another big thing', parent_id: @agenda_item.id }, format: :json

      expect(conversation_member.member.unseen_objects.count).must_equal 1
      expect(conversation_member.member.unseen_objects.first.agenda_item_id).must_equal @agenda_item.id

      deliverable = Deliverable.find(JSON.parse(response.body)['data']['id'])
      perform_enqueued_jobs do
        patch :update, id: deliverable.id, deliverable: { parent_id: other_agenda_item.id }
      end
      expect(conversation_member.member.unseen_objects.reload.count).must_equal 1
      expect(conversation_member.member.unseen_objects.reload.first.agenda_item_id).must_equal other_agenda_item.id
    end

    it 'shows an archived deliverable' do
      @deliverable.toggle_archive(true)
      
      get :show, id: @deliverable

      assert_response :success   
    end

    it 'sends an email notification when a deliverable gets assigned' do
      @other_user = FactoryGirl.create(:conversation_member, conversation: @conversation).member

      perform_enqueued_jobs do
        post :create, deliverable: { title: 'Something to do', parent_id: @conversation.id, parent_type: 'Conversation', assignee_id: @other_user.id }
      end
      assert_response :success
      expect(@other_user.assigned_deliverables.count).must_equal 1

      mail = open_email(@other_user.email)
      expect(mail).must_be :present?
      value(mail.subject).must_match "#{@current_user.first_name} assigned a deliverable to you"
    end

    it 'sends an email notification when a deliverable gets reassigned' do
      @other_user = FactoryGirl.create(:conversation_member, conversation: @conversation).member
      
      perform_enqueued_jobs do
        patch :update, id: @deliverable.id, deliverable: { assignee_id: @other_user.id }
      end
      assert_response :success
      expect(@other_user.assigned_deliverables.count).must_equal 1

      mail = open_email(@other_user.email)
      expect(mail).must_be :present?
      value(mail.subject).must_match "#{@current_user.first_name} assigned a deliverable to you"
    end

    it 'does not send an email notification when a deliverable gets updated but not reassigned' do
      @other_user = FactoryGirl.create(:conversation_member, conversation: @conversation).member
      
      perform_enqueued_jobs do
        patch :update, id: @deliverable.id, deliverable: { title: 'Changed title' }
      end
      assert_response :success
      expect(@other_user.assigned_deliverables.count).must_equal 0

      [@other_user, @current_user, @deliverable.owner, @deliverable.assignee].each do |user|
        expect {
          open_email(user.email)
        }.must_raise EmailSpec::CouldNotFindEmailError
      end
    end
  end
end
