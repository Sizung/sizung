require 'test_helper'

describe OrganizationsController do
  include Devise::TestHelpers

  describe 'visitor' do
    it 'should not see any organizations' do
      get :index
      assert_response :redirect
      assert_redirected_to new_user_session_path
    end
  end

  describe 'signed in' do
    setup do
      @organization = FactoryGirl.create(:organization)
      @another_organization = FactoryGirl.create(:organization)
      @request.env['devise.mapping'] = Devise.mappings[:user]
      sign_in @organization.owner
    end

    it 'lists all organizations for json' do
      get :index, format: :json
      assert_response :success
      organizations = assigns(:organizations)
      assert_not_nil organizations
      assert_equal 1, organizations.size
    end

    it 'lists all organizations for html redirects to first organization' do
      get :index
      assert_response :redirect
    end

    it 'creates a new organization' do
      assert_difference('Organization.count') do
        post :create, organization: { name: 'My second organization' }
      end

      assert_redirected_to organization_path(assigns(:organization))
    end

    it 'shows a single organization' do
      get :show, id: @organization
      assert_response :success
    end

    it 'updates an existing organization' do
      put :update, id: @organization, organization: { name: 'My changed organization name' }
      assert_redirected_to organization_path(assigns(:organization))
      assert_equal 'My changed organization name', @organization.reload.name
    end

    it 'destroys a organization' do
      assert_difference('Organization.count', -1) do
        delete :destroy, id: @organization
      end

      assert_redirected_to organizations_path
    end
  end
end
