require 'test_helper'

describe Api::ConversationsController do
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
      @other_conversation = FactoryGirl.create(:conversation, organization: @conversation.organization)
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

    it 'shows a single conversation' do
      get :show, id: @conversation
      assert_response :success
    end
  end
end
