require 'test_helper'
require 'support/auth'
require 'support/email'

class UserInviteTest < ActionDispatch::IntegrationTest
  test 'User can invite an existing user the current organization' do
    skip("Skipped until there is a better test integration for react code")
    @user       = FactoryGirl.create :user
    @other_user = FactoryGirl.create :user
    @other_organization = @other_user.organizations.first
    login(@user)
    invite(@other_user.email)

    #
    # Accept the invitation
    #
    logout
    visit(parse_email_for_explicit_link(open_email(@other_user.email), 'sign in'))
    assert page.has_content? 'Login'

    #
    # Assert that they are in the same organization now
    #
    assert_equal 2, User.all.size
    assert_equal 2, Organization.all.size
    assert_equal 1, @other_organization.members.size
    assert_equal 1, @user.organizations.size
    assert_equal 2, @user.organizations.first.members.size
    assert_includes @user.organizations.first.members, @user
    assert_includes @user.organizations.first.members, @other_user
  end

  test 'User can invite a pending user' do
    skip("Skipped until there is a better test integration for react code")
    @user       = FactoryGirl.create :user
    @other_user = FactoryGirl.create :user
    @other_organization = @other_user.organizations.first
    login(@user)
    invite(@other_user.email)
    invite(@other_user.email)

    #
    # Accept the invitation
    #
    logout
    visit(parse_email_for_explicit_link(open_email(@other_user.email), 'sign in'))
    assert page.has_content? 'Login'

    #
    # Assert that they are in the same organization now
    #
    assert_equal 2, User.all.size
    assert_equal 2, Organization.all.size
    assert_equal 1, @other_organization.members.size
    assert_equal 1, @user.organizations.size
    assert_equal 2, @user.organizations.first.members.size
    assert_includes @user.organizations.first.members, @user
    assert_includes @user.organizations.first.members, @other_user
  end

  test 'User can invite a new user to the current organization' do
    skip("Skipped until there is a better test integration for react code")
    @user = FactoryGirl.create :user
    login(@user)

    invite('new_user@example.com')

    #
    # Accept the invitation
    #
    logout
    visit(parse_email_for_explicit_link(open_email('new_user@example.com'), 'accept'))

    fill_in :user_first_name, with: 'Sam'
    fill_in :user_last_name, with: 'Sample'

    fill_in :user_password, with: 'SuperSecret'
    fill_in :user_password_confirmation, with: 'SuperSecret'
    click_on 'Set my password'

    #
    # Assert that they are in the same organization now
    #
    assert_equal 2, User.all.size
    assert_equal 1, Organization.all.size
    assert_equal 2, Organization.first.members.size
    assert_includes Organization.first.members, User.find_by(email: @user.email)
    assert_includes Organization.first.members, User.find_by(email: 'new_user@example.com')
  end


  private

  def invite(email_address)
    @organization ||= @user.organizations.first
    visit organization_organization_members_path(@organization)
    fill_in :user_email, with: email_address
    click_on 'Send an invitation'
    assert page.has_content?("An invitation email has been sent to #{email_address}.")
    assert open_email(email_address)
  end
end
