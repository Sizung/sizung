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

    it 'returns a 422 when unprocessable' do
      post :create, deliverable: { parent_id: @conversation.id, parent_type: 'Conversation' }, format: :json
      expect(response.status).must_equal 422
    end
    
    it 'updates the deliverable' do
      patch :update, id: @deliverable.id, deliverable: { title: 'Changed title' }, format: :json

      assert_response :success
      deliverable = JSON.parse(response.body)
      assert_equal 'Changed title', deliverable['data']['attributes']['title']
    end

    it 'archive deliverable' do
      perform_enqueued_jobs do
        patch :update, id: @deliverable.id, deliverable: { archived: true }
      end

      assert_response :success
      expect(@deliverable.reload).must_be :paranoia_destroyed?

      deliverable = JSON.parse(response.body)
      assert_equal true, deliverable['data']['attributes']['archived']
    end

    it 'resolves a deliverable' do
      perform_enqueued_jobs do
        patch :update, id: @deliverable.id, deliverable: { status: 'resolved' }
      end

      assert_response :success
      expect(@deliverable.reload).must_be :resolved?

      deliverable = JSON.parse(response.body)
      assert_equal 'resolved', deliverable['data']['attributes']['status']
    end

    it 'should freeze archived deliverables' do
      patch :update, id: @deliverable.id, deliverable: { archived: true }
      expect {
        patch :update, id: @deliverable.id, deliverable: { title: 'changed title' }
      }.must_raise ActiveRecord::RecordNotFound
    end

    it 'removes the unseen objects when a deliverable gets archived' do
      conversation_member = FactoryGirl.create :conversation_member, conversation: @agenda_item.conversation

      perform_enqueued_jobs do
        post :create, deliverable: { title: 'Another big thing', parent_id: @agenda_item.id }, format: :json
      end
      
      expect(conversation_member.member.unseen_objects.count).must_equal 1

      deliverable = Deliverable.find(JSON.parse(response.body)['data']['id'])
      patch :update, id: deliverable.id, deliverable: { archived: true }

      expect(conversation_member.member.reload.unseen_objects.count).must_equal 0
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
      value(mail.subject).must_match "#{@current_user.first_name} assigned an action to you"
    end

    it 'sends an email notification when a deliverable gets reassigned' do
      old_assignee = FactoryGirl.create(:conversation_member, conversation: @conversation).member
      new_assignee = FactoryGirl.create(:conversation_member, conversation: @conversation).member
      deliverable  = FactoryGirl.create(:deliverable, parent: @conversation, assignee: old_assignee)

      perform_enqueued_jobs do
        post :update, id: deliverable.id, deliverable: { assignee_id: new_assignee.id }
      end
      
      assert_response :success
      expect(old_assignee.assigned_deliverables.count).must_equal 0
      expect(new_assignee.assigned_deliverables.count).must_equal 1

      mail = open_email(old_assignee.email)
      expect(mail).must_be :present?
      value(mail.subject).must_match "#{@current_user.first_name} unassigned you from an action"

      mail = open_email(new_assignee.email)
      expect(mail).must_be :present?
      value(mail.subject).must_match "#{@current_user.first_name} assigned an action to you"
    end
    
    it 'only notifies when assigned to someone else' do
      perform_enqueued_jobs do
        post :create, deliverable: { title: 'Something to do', parent_id: @conversation.id, parent_type: 'Conversation', assignee_id: @current_user.id }
      end
      assert_response :success
      expect(@current_user.assigned_deliverables.count).must_equal 2 # the other deliverable is created in the setup section on the top
      
      expect {
        open_email(@current_user.email)
      }.must_raise EmailSpec::CouldNotFindEmailError
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
      value(mail.subject).must_match "#{@current_user.first_name} assigned an action to you"
    end

    it 'only notifies when reassigned to someone else' do
      @other_user = FactoryGirl.create :user
      @new_deliverable = FactoryGirl.create :deliverable, assignee: @other_user, parent: @agenda_item
      
      perform_enqueued_jobs do
        post :update, id: @new_deliverable.id, deliverable: { assignee_id: @current_user.id }
      end
      assert_response :success
      expect(@current_user.assigned_deliverables.count).must_equal 2 # the other deliverable is created in the setup section on the top
      
      expect {
        open_email(@current_user.email)
      }.must_raise EmailSpec::CouldNotFindEmailError
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
