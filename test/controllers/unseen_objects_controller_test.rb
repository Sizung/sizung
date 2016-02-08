require 'test_helper'

describe Api::UnseenObjectsController do
  include Devise::TestHelpers

  # describe 'visitor' do
  #   it 'should not be allowed to create a new comment' do
  #     post :create, comment: {body: 'A comment from an unregistered visitor.'}
  #     assert_redirected_to new_user_session_path
  #   end
  # end

  describe 'signed in' do
    setup do
      @agenda_item = FactoryGirl.create(:agenda_item)
      @comment = FactoryGirl.create(:comment, commentable: @agenda_item)
      @unseen_object = UnseenObject.create_from!(@comment, @agenda_item.owner)
      @request.env['devise.mapping'] = Devise.mappings[:user]
      @current_user = @agenda_item.owner
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
    end
  end
end
