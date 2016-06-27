require 'test_helper'
require 'support/auth'

describe Api::DevicesController do
  include Devise::TestHelpers

  describe 'visitor' do
    it 'should not be allowed to register a new device' do
      post :create, device: {token: 'blah blah'}
      assert_redirected_to new_user_session_path
    end
  end

  describe 'signed in' do
    setup do
      @request.env['devise.mapping'] = Devise.mappings[:user]
      @current_user = FactoryGirl.create :user
      set_jwt(@current_user)
    end

    it 'registers a new device' do
      expect {
        post :create, device: { token: 'this is a random token' }, format: :json
      }.must_change 'Device.count'

      assert_response :success
      agenda_item = JSON.parse(response.body)
      assert_equal 'this is a random token', agenda_item['data']['attributes']['token']
      assert_equal @current_user.id, agenda_item['data']['relationships']['user']['data']['id']
    end

    it 'should not create a duplicated token for the same user' do
      device = FactoryGirl.create :device, token: 'abc123', user: @current_user
      expect {
        post :create, device: { token: 'abc123' }, format: :json
      }.wont_change 'Device.count'

      assert_response :success
      agenda_item = JSON.parse(response.body)
      assert_equal 'abc123', agenda_item['data']['attributes']['token']
      assert_equal @current_user.id, agenda_item['data']['relationships']['user']['data']['id']
    end
  end
end
