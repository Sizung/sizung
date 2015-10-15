require 'test_helper'

describe ConversationsController do
  include Devise::TestHelpers

  describe 'visitor' do
    it 'should not see any conversations' do
      get :index
      assert_response :redirect
      assert_redirected_to new_user_session_path
    end
  end

  describe 'signed in' do
    setup do
      @conversation = FactoryGirl.create(:conversation)
      @other_conversation = FactoryGirl.create(:conversation)
      @request.env['devise.mapping'] = Devise.mappings[:user]
      sign_in @conversation.organization.owner
    end

    it 'lists all conversations' do
      get :index
      assert_response :success
      conversations = assigns(:conversations)
      assert_not_nil conversations
      assert_equal 2, conversations.size
    end

    it 'creates a new conversation' do
      organization = FactoryGirl.create(:organization)
      assert_difference('Conversation.count') do
        post :create, conversation: { organization_id: organization.id, title: 'Our general discussion' }
      end

      assert_redirected_to conversation_path(assigns(:conversation))
    end

    it 'shows a single conversation' do
      get :show, id: @conversation
      assert_response :success
    end

    it 'updates an existing conversation' do
      put :update, id: @conversation, conversation: { organization_id: @conversation.organization_id, title: @conversation.title }
      assert_redirected_to conversation_path(assigns(:conversation))
    end

    it 'destroys a conversation' do
      assert_difference('Conversation.count', -1) do
        delete :destroy, id: @conversation
      end

      assert_redirected_to conversations_path
    end
  end
end