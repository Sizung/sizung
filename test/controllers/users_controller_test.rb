require 'test_helper'

describe Api::UsersController do
  include Devise::TestHelpers


  describe 'sign up' do

    it 'creates user' do
      expect {
        post :create, user: { email: 'batman@gotham.com', first_name: 'Bruce', last_name: 'Wayne', password: '11111111', password_confirmation: '11111111', organization: { name: 'Wayne Enterprises'}, }, format: :json
      }.must_change 'User.count'

      assert_response :success
      user = JSON.parse(response.body)
      assert_equal 'batman@gotham.com', user['data']['attributes']['email']
    end

  end
end
