require 'test_helper'

describe ConversationsController do
  include Devise::TestHelpers

  describe 'visitor' do
    it 'should not see any conversations' do
      @conversation = FactoryGirl.create(:conversation)
      get :index, organization_id: @conversation.organization
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

    it 'lists all conversations for json' do
      get :index, organization_id: @conversation.organization_id, format: :json
      assert_response :success
      conversations = assigns(:conversations)
      assert_not_nil conversations
      assert_equal 2, conversations.size
    end

    it 'lists all conversations for html redirects to organization overview page' do
      get :index, organization_id: @conversation.organization_id
      assert_response :redirect
    end

    it 'creates a new conversation' do
      organization = @conversation.organization
      assert_difference('Conversation.count') do
        post :create, organization_id: organization.id, conversation: { organization_id: organization.id, title: 'Our general discussion' }
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

      assert_redirected_to organization_path(@conversation.organization)
    end
  end
end
