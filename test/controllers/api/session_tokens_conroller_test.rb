require 'test_helper'

describe Api::SessionTokensController do
  include Devise::TestHelpers

  describe 'visitors' do

    setup do
      @request.env['devise.mapping'] = Devise.mappings[:user]
    end

    it 'creates a new session token using username and password' do
      user = FactoryGirl.create :user, password: 'secret123', password_confirmation: 'secret123'
      post :create, user: { email: user.email, password: 'secret123' }, format: :json

      assert_response :success
      auth_token = JSON.parse(response.body)
      expect(auth_token).wont_equal nil
    end

    it 'does not create a session token if username or password is wrong' do
      user = FactoryGirl.create :user, password: 'secret123', password_confirmation: 'secret123'
      post :create, user: { email: user.email, password: 'wrongsecret' }, format: :json

      assert_response 401
      auth_token = JSON.parse(response.body)
      expect(auth_token).must_equal({ 'error' => 'Invalid email or password.' })
    end
  end
end
