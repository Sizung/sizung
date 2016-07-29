require 'test_helper'

describe Api::LongLivedTokensController do
  include Devise::TestHelpers

  describe 'visitors' do
    it 'create a new long lived token using the session token' do
      user  = FactoryGirl.create :user, password: 'secret123', password_confirmation: 'secret123'
      token = JsonWebToken.encode('user_id' => user.id)
      @request.headers['Authorization'] = "Bearer #{token}"

      post :create, format: :json

      assert_response :success
      json_body = JSON.parse(response.body)
      long_lived_token = json_body['token']
      expect(long_lived_token).wont_equal nil
      payload = JsonWebToken.decode(long_lived_token, user.long_lived_token_secret)
      expect(payload['user_id']).must_equal user.id
      expect(payload['exp'] > 13.days.from_now.to_i).must_equal true
      expect(payload['type']).must_equal 'long-lived'
    end

    it 'does not create a long lived token if session token is wrong' do
      user  = FactoryGirl.create :user, password: 'secret123', password_confirmation: 'secret123'
      token = JsonWebToken.encode('user_id' => '123')
      @request.headers['Authorization'] = "Bearer #{token}"
      
      post :create, format: :json
      
      assert_response 401
      auth_token = JSON.parse(response.body)
      expect(auth_token).must_equal({ 'error' => 'Failed to Login' })
    end
  end
end
