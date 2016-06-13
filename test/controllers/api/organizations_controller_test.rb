require 'test_helper'

describe Api::OrganizationsController do
  include Devise::TestHelpers

  describe 'signed in' do
    setup do
      @organization = FactoryGirl.create(:organization)
      @another_organization = FactoryGirl.create(:organization)
      @request.env['devise.mapping'] = Devise.mappings[:user]
      sign_in @organization.owner
    end

    it 'updates an existing organization' do
      put :update, id: @organization, organization: { name: 'Avengers', mission: 'Save the World' }
      expect(@organization.reload.name).must_equal 'Avengers'
      expect(@organization.reload.mission).must_equal 'Save the World'
    end

    it 'should give me a 200 when found' do
      get :show, id: @organization
      expect(response.status).must_equal 200
    end

    it 'should raise a RecordNotFound when not found' do
      expect {
        get :show, id: 'random123'
      }.must_raise ActiveRecord::RecordNotFound
    end
  end
end
