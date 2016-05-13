require 'test_helper'

describe Api::AttachmentsController do
  include Devise::TestHelpers

  describe 'visitor' do
    it 'should not be allowed to upload a file' do
      get :new, { parent_type: 'Conversation', conversation_id: ''}
      assert_redirected_to new_user_session_path
    end
  end

  describe 'signed in' do
    setup do
      @organization                  = FactoryGirl.create(:organization)
      @conversation                  = FactoryGirl.create(:conversation, organization: @organization)
      @request.env['devise.mapping'] = Devise.mappings[:user]
      @current_user                  = @organization.owner
      sign_in @current_user
    end

    it 'sends you a url to upload your file to' do
      get :new, { parent_type: 'Conversation', conversation_id: @conversation.id }, format: :json
      assert_response :success
      body = JSON.parse(response.body)
      expect(body['signedUrl']).wont_be :nil?
    end

    it 'creates a new attachment' do
      file_id = 'http://example.com/test-image.png'
      file_name = 'test-image.png'
      file_size = 100
      post :create, { parent_type: 'Conversation', conversation_id: @conversation.id, attachment: { persistent_file_id: file_id, file_name: file_name, file_size: file_size } }, format: :json
      assert_response :success
      body = JSON.parse(response.body)
      expect(body['data']['attributes']['persistent_file_id']).must_equal file_id
      expect(body['data']['attributes']['file_name']).must_equal file_name
      expect(body['data']['attributes']['file_size']).must_equal file_size
      expect(body['data']['relationships']['owner']['data']['id']).must_equal @current_user.id
    end
  end
end

