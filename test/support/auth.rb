def login(user)
  visit user_session_path
  assert_equal 200, page.status_code
  fill_in :user_email, with: user.email
  fill_in :user_password, with: 'SuperSecret'

  click_on 'Log in'
  assert_equal 200, page.status_code
end

def logout
  Capybara.current_session.driver.delete destroy_user_session_path
end
