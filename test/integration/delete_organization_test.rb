require 'test_helper'

class DeleteOrganizationTest < ActionDispatch::IntegrationTest
  test 'User can delete its own organization' do
    visit user_session_path
    current_user = FactoryGirl.create :user
    fill_in :user_email, with: current_user.email
    fill_in :user_password, with: 'SuperSecret'

    click_on 'Log in'

    organization = FactoryGirl.create :organization_without_owner, owner: current_user
    FactoryGirl.create :organization_member, organization: organization, member: current_user

    expect(Organization.all.size).must_equal 2

    expect {
      visit edit_organization_path(organization)
      click_on 'Delete Organization'
    }.must_change 'Organization.count', -1
  end
end