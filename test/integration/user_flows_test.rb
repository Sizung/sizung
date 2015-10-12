require 'test_helper'

class UserFlowsTest < ActionDispatch::IntegrationTest
  test 'User can see home page after login' do
    visit user_session_path
    assert_equal 200, page.status_code
    @user = FactoryGirl.create :user
    fill_in :user_email, with: @user.email
    fill_in :user_password, with: 'SuperSecret'

    click_on 'Log in'
    assert_equal 200, page.status_code
    assert_equal '/', page.current_path
    assert page.has_content?('Signed in successfully.')
  end

  test 'Sign up creates a Organization' do
    visit new_user_registration_path
    assert_equal 200, page.status_code

    fill_in :user_email, with: 'sam.sample@example.com'
    fill_in :user_first_name, with: 'Sam'
    fill_in :user_last_name, with: 'Sample'
    fill_in :user_password, with: 'SuperSecret'
    fill_in :user_password_confirmation, with: 'SuperSecret'

    within('form') do
      click_on 'Sign up'
    end

    assert_equal 200, page.status_code
    assert_equal '/', page.current_path
    assert page.has_content? 'A message with a confirmation link has been sent to your email address. Please follow the link to activate your account.'
    assert_equal 1, Organization.all.size
    assert_equal Organization::DEFAULT_NAME, User.order(:created_at).last.organizations.order(:created_at).last.name
  end

end