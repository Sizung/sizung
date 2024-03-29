require 'test_helper'

describe Api::ConversationMembersController do
  include Devise::TestHelpers

  describe 'visitor' do
    it 'should not be allowed to create a new conversation member' do
      conversation = FactoryGirl.create :conversation
      user = FactoryGirl.create :user
      post :create, conversation_member: {conversation_id: conversation.id, member_id: user.id}, format: :json
      assert_response 401
    end
  end

  describe 'signed in' do
    setup do
      @conversation = FactoryGirl.create(:conversation)
      @request.env['devise.mapping'] = Devise.mappings[:user]
      @current_user = @conversation.organization.owner
      sign_in @current_user
    end

    it 'creates conversation_member' do
      user = FactoryGirl.create :user
      FactoryGirl.create :organization_member_without_owner, organization: @conversation.organization, member: user
      expect {
        post :create, conversation_member: { conversation_id: @conversation.id, member_id: user.id }, format: :json
      }.must_change 'ConversationMember.count'

      assert_response :success
      conversation_member = JSON.parse(response.body)
      assert_equal @conversation.id, conversation_member['data']['relationships']['conversation']['data']['id']
      assert_equal user.id, conversation_member['data']['relationships']['member']['data']['id']
    end

    it 'creates conversation as unseen object when a new conversation_member gets created' do
      user = FactoryGirl.create :user
      FactoryGirl.create :organization_member_without_owner, organization: @conversation.organization, member: user
      FactoryGirl.create :conversation_member, conversation: @conversation
      expect {
        post :create, conversation_member: { conversation_id: @conversation.id, member_id: user.id }, format: :json
      }.must_change 'UnseenObject.count', 1

      expect (UnseenObject.last.user).must_equal user
    end

    it 'does not allow to create conversation_member when the user is not part of the conversations organization' do
      user = FactoryGirl.create :user
      post :create, conversation_member: { conversation_id: @conversation.id, member_id: user.id }, format: :json
      expect(response.status).must_equal 401
    end

    it 'removes conversation_member' do
      conversation_member = FactoryGirl.create :conversation_member, conversation: @conversation
      FactoryGirl.create :organization_member_without_owner, organization: @conversation.organization, member: conversation_member.member
      expect {
        delete :destroy, id: conversation_member.id, format: :json
      }.must_change 'ConversationMember.count', -1

      assert_response :success
    end

    it 'does not allow to remove conversation_member when the user is not part of the conversations organization' do
      conversation_member = FactoryGirl.create :conversation_member, conversation: @conversation
      delete :destroy, id: conversation_member.id, format: :json
      expect(response.status).must_equal 401
    end
  end
end
