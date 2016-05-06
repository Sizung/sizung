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

    it 'creates a new conversation' do
      @organization = FactoryGirl.create(:organization)
      sign_in @organization.owner
      expect {
        post :create, conversation: { title: 'Dark Knight Rises', organization_id: @organization.id }, format: :json
      }.must_change 'Conversation.count'

      assert_response :success
      conversation = JSON.parse(response.body)

      assert_equal 'Dark Knight Rises', conversation['data']['attributes']['title']
    end

    it 'creates a new conversation with multiple members' do
      @organization = FactoryGirl.create(:organization)
      @user1 = FactoryGirl.create(:user)
      @user2 = FactoryGirl.create(:user)
      sign_in @organization.owner
      expect {
        post :create, conversation: { title: 'Dark Knight Rises', organization_id: @organization.id, conversation_members: [ {member_id: @user1.id}, {member_id: @user2.id} ] }, format: :json
      }.must_change 'Conversation.count'

      assert_response :success
      conversation = JSON.parse(response.body)

      assert_equal 'Dark Knight Rises', conversation['data']['attributes']['title']
    end

    it 'deletes a conversation' do
      assert_difference('Conversation.count', -1) do
        delete :destroy, id: @conversation
      end
    end

    it 'archive conversation' do
      patch :update, id: @conversation.id, conversation: { archived: true }

      assert_response :success
      expect(@conversation.reload).must_be :paranoia_destroyed?

      conversation = JSON.parse(response.body)
      assert_equal true, conversation['data']['attributes']['archived']
    end
  end
end
