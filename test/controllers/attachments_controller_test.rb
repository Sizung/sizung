require 'test_helper'

describe AttachmentsController do
  include Devise::TestHelpers

  describe 'visitor' do
    it 'should not be allowed to upload a file' do
      get :show, { id: 'test' }
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

    it 'redirects to the private url for the persisted file' do
      file_id = 'http://example.com/test-image.png'
      file_name = 'test-image.png'
      file_size = 100
      
      attachment = FactoryGirl.create :attachment, persistent_file_id: file_id

      get :show, { id: attachment.id }
      assert_response :redirect
      expect(response.location).must_match 'https://s3.amazonaws.com'
    end
  end
end

