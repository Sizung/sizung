require 'test_helper'
require 'support/auth'

describe Api::AgendaItemsController do
  include Devise::TestHelpers

  describe 'visitor' do
    it 'should not be allowed to create a new agenda item' do
      post :create, agenda_item: {title: 'Last weeks review'}
      assert_redirected_to new_user_session_path
    end
  end

  describe 'signed in' do
    setup do
      @conversation = FactoryGirl.create(:conversation)
      @request.env['devise.mapping'] = Devise.mappings[:user]
      @current_user = @conversation.organization.owner
      set_jwt(@current_user)
      @agenda_item  = FactoryGirl.create(:agenda_item, conversation: @conversation, owner: @current_user)
    end

    it 'creates agenda item' do
      expect {
        post :create, agenda_item: { title: 'Last months review', conversation_id: @conversation.id }, format: :json
      }.must_change 'AgendaItem.count'

      assert_response :success
      agenda_item = JSON.parse(response.body)
      assert_equal 'Last months review', agenda_item['data']['attributes']['title']
      assert_equal @current_user.id, agenda_item['data']['relationships']['owner']['data']['id']
    end

    it 'creates agenda item with a different owner' do
      user = FactoryGirl.create :unconfirmed_user_without_organization
      expect {
        post :create, agenda_item: { title: 'Last months review', conversation_id: @conversation.id, owner_id: user.id }, format: :json
      }.must_change 'AgendaItem.count'

      assert_response :success
      agenda_item = JSON.parse(response.body)
      assert_equal 'Last months review', agenda_item['data']['attributes']['title']
      assert_equal user.id, agenda_item['data']['relationships']['owner']['data']['id']
    end

    it 'creates agenda item with a due_on date' do
      expect {
        post :create, agenda_item: { title: 'Last months review', conversation_id: @conversation.id, due_on: Date.today }, format: :json
      }.must_change 'AgendaItem.count'

      assert_response :success
      agenda_item = JSON.parse(response.body)
      assert_equal 'Last months review', agenda_item['data']['attributes']['title']
      assert_equal @current_user.id, agenda_item['data']['relationships']['owner']['data']['id']
      assert_equal Date.today.to_s(:db), agenda_item['data']['attributes']['due_on']
    end
    
    it 'returns a 422 when unprocessable' do
      post :create, agenda_item: { conversation_id: @conversation.id }, format: :json
      expect(response.status).must_equal 422
    end
    
    it 'updates the agenda item' do
      patch :update, id: @agenda_item.id, agenda_item: { title: 'Changed title' }, format: :json

      assert_response :success
      agenda_item = JSON.parse(response.body)
      assert_equal 'Changed title', agenda_item['data']['attributes']['title']
    end

    it 'archive agenda item' do
      patch :update, id: @agenda_item.id, agenda_item: { archived: true }

      assert_response :success
      expect(@agenda_item.reload).must_be :paranoia_destroyed?

      agenda_item = JSON.parse(response.body)
      assert_equal true, agenda_item['data']['attributes']['archived']
    end

    it 'updates owner and due_on date' do
      user = FactoryGirl.create :unconfirmed_user_without_organization
      patch :update, id: @agenda_item.id, agenda_item: { owner_id: user.id, due_on: Date.today }

      assert_response :success

      agenda_item = JSON.parse(response.body)
      assert_equal Date.today.to_s(:db), agenda_item['data']['attributes']['due_on']
      assert_equal user.id, agenda_item['data']['relationships']['owner']['data']['id']
    end
    
    it 'should freeze archived agenda items' do
      patch :update, id: @agenda_item.id, agenda_item: { archived: true }
      expect {
        patch :update, id: @agenda_item.id, agenda_item: { title: 'changed title' }
      }.must_raise ActiveRecord::RecordNotFound
    end

    it 'removes the unseen objects when an agenda item gets archived' do
      conversation_member = FactoryGirl.create :conversation_member, conversation: @agenda_item.conversation
      post :create, agenda_item: { title: 'Another big thing to discuss', conversation_id: @agenda_item.conversation.id }, format: :json

      expect(conversation_member.member.unseen_objects.count).must_equal 1

      agenda_item = AgendaItem.find(JSON.parse(response.body)['data']['id'])
      patch :update, id: agenda_item.id, agenda_item: { archived: true }

      expect(conversation_member.member.reload.unseen_objects.count).must_equal 0
    end

    it 'shows an archived agenda item' do
      @agenda_item.toggle_archive(true)
      
      get :show, id: @agenda_item

      assert_response :success      
    end
  end
end
