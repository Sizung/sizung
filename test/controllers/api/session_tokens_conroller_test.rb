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

      assert_response 201
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

    it 'creates a new session token using the long-lived token' do
      user = FactoryGirl.create :user, password: 'secret123', password_confirmation: 'secret123'
      long_lived_token = JsonWebToken.encode_long_lived({'user_id' => user.id}, user.long_lived_token_secret)

      post :create, long_lived_token: long_lived_token, format: :json

      assert_response 201

      auth_token = JSON.parse(response.body)
      expect(auth_token).wont_equal nil
    end

    it 'returns 401 when the long-lived token can not be verified' do
      user = FactoryGirl.create :user, password: 'secret123', password_confirmation: 'secret123'
      long_lived_token = JsonWebToken.encode_long_lived({'user_id' => user.id}, 'a wrong secret')

      post :create, long_lived_token: long_lived_token, format: :json

      assert_response 401
      json_body = JSON.parse(response.body)
      expect(json_body['error']).must_equal 'The long lived token is missing, wrong, expired or got revoked. You have to login again and create a new one.'
    end
  end
end
