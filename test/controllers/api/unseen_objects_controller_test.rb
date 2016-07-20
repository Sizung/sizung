require 'test_helper'

describe Api::UnseenObjectsController do
  include Devise::TestHelpers

  describe 'signed in' do
    setup do
      @agenda_item                   = FactoryGirl.create(:agenda_item)
      @comment                       = FactoryGirl.create(:comment, commentable: @agenda_item)
      @unseen_object                 = UnseenObject.create_from!(@comment, @agenda_item.owner)
      @request.env['devise.mapping'] = Devise.mappings[:user]
      @current_user                  = @agenda_item.owner
      sign_in @current_user
    end

    it 'destroys unseen objects' do
      expect {
        delete :destroy_all, agenda_item_id: @agenda_item, parent_type: 'AgendaItem'
      }.must_change 'UnseenObject.count', -1

      assert_response :success
    end

    it 'destroys unseen objects for direct children of a conversation' do
      @conversation = @agenda_item.conversation
      @comment = FactoryGirl.create(:comment, commentable: @conversation)
      @unseen_object = UnseenObject.create_from!(@comment, @agenda_item.owner)
      expect {
        delete :destroy_all, conversation_id: @conversation, parent_type: 'Conversation'
      }.must_change 'UnseenObject.count', -1

      assert_response :success
    end

    it 'destroys unseen objects for a conversation' do
      @conversation = @agenda_item.conversation
      @unseen_object = UnseenObject.create_from!(@conversation, @current_user)
      expect {
        delete :destroy_all, conversation_id: @conversation, parent_type: 'Conversation'
      }.must_change 'UnseenObject.count', -1

      assert_response :success
      json_response = JSON.parse(response.body)
      expect(json_response['data'].size).must_equal 1
    end

    it 'gets all unseen objects for a user' do
      get :index, parent_type: 'User', user_id: @current_user.id

      assert_response :success

      body = JSON.parse(response.body)
      expect(body['data'].size).must_equal 1
      expect(body['data'].first['id']).must_equal @unseen_object.id
    end

    it 'gets only the subscribed unseen objects for a user' do
      @comment                  = FactoryGirl.create(:comment, commentable: @agenda_item)
      @unseen_object_subscribed = UnseenObject.create_from!(@comment, @agenda_item.owner)
      @unseen_object_subscribed.update(subscribed: true)

      get :index, parent_type: 'User', user_id: @current_user.id, filter: 'subscribed'

      assert_response :success

      body = JSON.parse(response.body)
      expect(body['data'].size).must_equal 1
      expect(body['data'].first['id']).must_equal @unseen_object_subscribed.id

      get :index, parent_type: 'User', user_id: @current_user.id, filter: 'unsubscribed'

      assert_response :success

      body = JSON.parse(response.body)
      expect(body['data'].size).must_equal 1
      expect(body['data'].first['id']).must_equal @unseen_object.id

      get :index, parent_type: 'User', user_id: @current_user.id

      assert_response :success

      body = JSON.parse(response.body)
      expect(body['data'].size).must_equal 2
    end
    
    it 'gets unseen objects including the requested includes' do
      get :index, parent_type: 'User', user_id: @current_user.id, include: 'user,target,agenda_item,timeline'

      assert_response :success
      body = JSON.parse(response.body)
      expect(included(body, 'type', 'users')).must_equal true
      expect(included(body, 'type', 'comments')).must_equal true
      expect(included(body, 'type', 'agenda_items')).must_equal true
      expect(body['data'].first['id']).must_equal @unseen_object.id
    end

    def included(json, key, value)
      json['included'].each do |obj|
        return true if obj[key] == value
      end
      return false
    end
    
    it 'destroys unseen object for an agenda item on visiting agenda item w/o visiting it\'s parent conversation' do
      @new_agenda_item = FactoryGirl.create(:agenda_item)
      @unseen_object = UnseenObject.create_from!(@new_agenda_item, @current_user)
      expect {
        delete :destroy_all, agenda_item_id: @new_agenda_item, parent_type: 'AgendaItem'
      }.must_change 'UnseenObject.count', -1

      assert_response :success
    end
  end
end
