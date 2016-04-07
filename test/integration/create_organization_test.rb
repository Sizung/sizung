require 'test_helper'

class CreateOrganizationTest < ActionDispatch::IntegrationTest
  test 'User can create a new organization' do
    skip("Skipped until there is a better test integration for react code")
    visit user_session_path
    assert_equal 200, page.status_code
    @user = FactoryGirl.create :user
    fill_in :user_email, with: @user.email
    fill_in :user_password, with: 'SuperSecret'

    click_on 'Log in'

    visit new_organization_path
    fill_in :organization_name, with: 'gugl test organization'
    click_on 'Create Organization'

    assert_equal 2, Organization.all.size
  end
end
