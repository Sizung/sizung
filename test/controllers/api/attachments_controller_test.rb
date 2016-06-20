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
      file_id = "https://s3.amazonaws.com/dev-sizung/organizations/71c7a54b-6500-4683-b88f-efdd1e750746/attachments/c0031868-340a-42d2-9ac5-fe37679fafaa/me.png?X-Amz-Expires=900&X-Amz-Date=20160518T152540Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJY4SUFJDSZHWMP2Q/20160518/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host%3Bx-amz-acl&X-Amz-Signature=5f8e9811c270099e8e9fbf145f42ecedaa13e8d0c032cf52433787d2da91a24c"
      file_name = 'test-image.png'
      file_size = 100
      post :create, { parent_type: 'Conversation', conversation_id: @conversation.id, attachment: { persistent_file_id: file_id, file_name: file_name, file_size: file_size } }, format: :json
      assert_response :success

      expect(Attachment.all.size).must_equal 1
      attachment = Attachment.first
      expect(attachment.persistent_file_id).must_equal 'organizations/71c7a54b-6500-4683-b88f-efdd1e750746/attachments/c0031868-340a-42d2-9ac5-fe37679fafaa/me.png'
      
      body = JSON.parse(response.body)
      attachment_id = body['data']['id']
      expect(attachment_id).must_be :present?
      expect(body['data']['attributes']['file_url']).must_equal "#{ENV['SIZUNG_HOST']}/attachments/#{attachment_id}"
      expect(body['data']['attributes']['file_name']).must_equal file_name
      expect(body['data']['attributes']['file_size']).must_equal file_size
      expect(body['data']['relationships']['owner']['data']['id']).must_equal @current_user.id
    end

    it 'returns a 422 when unprocessable' do
      post :create, { parent_type: 'Conversation', conversation_id: @conversation.id, attachment: { persistent_file_id: 'example' } }, format: :json
      expect(response.status).must_equal 422
    end

    it 'archive attachment' do
      @attachment = FactoryGirl.create :attachment, parent: @conversation
      patch :update, id: @attachment.id, attachment: { archived: true }

      assert_response :success
      expect(@attachment.reload).must_be :paranoia_destroyed?
    end
  end
end

