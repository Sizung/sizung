require 'test_helper'

describe Api::OrganizationMembersController do
  include Devise::TestHelpers

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

    it 'removes organization_member' do
      organization_member = FactoryGirl.create :organization_member, organization: @organization
      expect {
        delete :destroy, id: organization_member.id, format: :json
      }.must_change 'OrganizationMember.count', -1

      assert_response :success
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
