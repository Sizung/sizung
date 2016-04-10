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

  describe 'signed in' do
    setup do
      @user = FactoryGirl.create(:user)
      @request.env['devise.mapping'] = Devise.mappings[:user]
      sign_in @user
    end

    it 'updates user' do
      patch :update, id: @user.id, user: { email: 'batman@gotham.com', first_name: 'bruce', last_name: 'wayne', password: '12345678', password_confirmation: '12345678' }
      assert_response :success
      expect(@user.reload.first_name).must_equal 'bruce'
      expect(@user.reload.last_name).must_equal 'wayne'
      expect(@user.reload.email).wont_equal 'batman@gotham.com'
    end
  end

end
