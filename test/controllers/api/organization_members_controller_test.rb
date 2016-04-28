require 'test_helper'

describe Api::OrganizationMembersController do
  include Devise::TestHelpers
  include ActiveJob::TestHelper
  
  describe 'visitor' do
    # it 'should not be allowed to create a new organization member' do
    #   organization = FactoryGirl.create :organization
    #   user = FactoryGirl.create :user
    #   post :create, organization_member: {organization_id: organization.id, member_id: user.id}, format: :json
    #   assert_response 401
    # end
  end

  describe 'signed in' do
    setup do
      @organization = FactoryGirl.create(:organization)
      @request.env['devise.mapping'] = Devise.mappings[:user]
      @current_user = @organization.owner
      sign_in @current_user
    end

    # it 'creates organization_member' do
    #   user = FactoryGirl.create :user
    #   expect {
    #     post :create, organization_member: { organization_id: @organization.id, member_id: user.id }, format: :json
    #   }.must_change 'OrganizationMember.count'
    #
    #   assert_response :success
    #   organization_member = JSON.parse(response.body)
    #   assert_equal @organization.id, organization_member['data']['relationships']['organization']['data']['id']
    #   assert_equal user.id, organization_member['data']['relationships']['member']['data']['id']
    # end

    # it 'does not allow to create organization_member when the user is not part of the organization' do
    #   user = FactoryGirl.create :user
    #   expect {
    #     post :create, organization_member: { organization_id: @organization.id, member_id: user.id }, format: :json
    #   }.must_raise Pundit::NotAuthorizedError
    # end

    it 'invites a completely new organization member' do
      email = 'newsam@sample.com'

      expect {
        post :create, { organization_id: @organization.id, email: email }
      }.must_change 'User.count', 1

      assert_enqueued_jobs 1
      
      assert_response :success

      organization_member = JSON.parse(response.body)
      assert_equal 'users', organization_member['data']['relationships']['member']['data']['type']
      assert_equal email, organization_member['included'].first['attributes']['email']
    end

    it 'invites an existing user to the organization' do
      user = FactoryGirl.create :user

      expect {
        post :create, { organization_id: @organization.id, email: user.email }
      }.must_change 'OrganizationMember.count', 1

      assert_response :success

      organization_member = JSON.parse(response.body)
      assert_equal 'users', organization_member['data']['relationships']['member']['data']['type']
      assert_equal user.email, organization_member['included'].first['attributes']['email']
    end
    
    it 'removes organization_member' do
      organization_member = FactoryGirl.create :organization_member, organization: @organization
      expect {
        delete :destroy, id: organization_member.id, format: :json
      }.must_change 'OrganizationMember.count', -1

      assert_response :success
    end

    it 'removes from all conversations of that org when the org member gets removed' do
      organization_member = FactoryGirl.create :organization_member, organization: @organization
      user = organization_member.member
      conversations = FactoryGirl.create_list :conversation_without_owner, 3, organization: @organization
      conversations.each { |conv| FactoryGirl.create :conversation_member, conversation: conv, member: user }

      other_organization = FactoryGirl.create :organization
      other_conversation = FactoryGirl.create :conversation_without_owner, organization: other_organization
      other_conversation_member = FactoryGirl.create :conversation_member, conversation: other_conversation, member: user

      expect(user.organizations.count).must_equal 2
      expect(user.conversations.count).must_equal 4
      
      expect {
        delete :destroy, id: organization_member.id, format: :json
      }.must_change 'ConversationMember.count', -3
      
      assert_response :success

      expect(user.organizations.count).must_equal 1
      expect(user.conversations.count).must_equal 1
    end

    it 'resets the last_visited_organization when a org member gets removed from an organization' do
      user                      = FactoryGirl.create :user_without_organization
      organization_member       = FactoryGirl.create :organization_member_without_owner, organization: @organization, member: user
      other_organization        = FactoryGirl.create :organization
      other_organization_member = FactoryGirl.create :organization_member_without_owner, organization: other_organization, member: user
      user.update! last_visited_organization: @organization

      expect(user.last_visited_organization_id).must_equal @organization.id
      expect(user.organizations.count).must_equal 2
      
      expect {
        delete :destroy, id: organization_member.id, format: :json
      }.must_change 'OrganizationMember.count', -1
      
      assert_response :success

      user.reload
      expect(user.organizations.count).must_equal 1
      expect(user.last_visited_organization_id).must_equal other_organization.id
    end

    it 'resets the last_visited_organization to nil when a members last org member gets removed' do
      user                      = FactoryGirl.create :user_without_organization
      organization_member       = FactoryGirl.create :organization_member_without_owner, organization: @organization, member: user
      user.update! last_visited_organization: @organization

      expect(user.last_visited_organization_id).must_equal @organization.id
      expect(user.organizations.count).must_equal 1
      
      expect {
        delete :destroy, id: organization_member.id, format: :json
      }.must_change 'OrganizationMember.count', -1
      
      assert_response :success

      user.reload
      expect(user.organizations.count).must_equal 0
      expect(user.last_visited_organization_id).must_equal nil
    end
    #
    # it 'does not allow to remove organization_member when the user is not part of the organizations organization' do
    #   organization_member = FactoryGirl.create :organization_member, organization: @organization
    #   expect {
    #     delete :destroy, id: organization_member.id, format: :json
    #   }.must_raise Pundit::NotAuthorizedError
    # end
  end
end
