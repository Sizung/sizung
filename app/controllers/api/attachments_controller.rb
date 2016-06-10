module Api
  class AttachmentsController < ApplicationController
    before_filter :authenticate_user!
    after_action :verify_authorized
    # after_action :verify_policy_scoped,   only: :index

    respond_to :json

    include Swagger::Blocks

    # GET /api/<parent_type>/<parent_id>/attachments/new.json
    def new
      parent

      storage = Fog::Storage.new(
        provider:              'AWS',
        aws_access_key_id:     ENV['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
      )

      options = { path_style: true }
      # headers = { "Content-Type" => params[:contentType], "x-amz-acl" => "public-read" }
      headers = { "x-amz-acl" => "private" }

      @url = storage.put_object_url(
        ENV['S3_BUCKET_NAME'],
        "organizations/#{parent.organization.id}/attachments/#{SecureRandom.uuid}/#{params[:objectName]}",
        15.minutes.from_now.to_time.to_i,
        headers,
        options
      )

      render json: { signedUrl: @url }
    end

    swagger_schema :AttachmentInput do
      key :required, [:attachment]

      property :attachment, type: :object, required: [:persistent_file_id, :file_name, :file_size] do
        property :persistent_file_id, type: :string
        property :file_name, type: :string
        property :file_size, type: :integer, description: 'File size in bytes'
        property :file_type, type: :string, description: 'The mime type of the file'
      end
    end
    
    swagger_path '/{parent_type}/{parent_id}/attachments' do
      operation :post, security: [bearer: []] do
        key :summary, 'Create a new Attachment.'
        key :description, 'Creates a new attachment'
        key :tags, ['attachment']
        
        parameter name: :parent_id, in: :path, type: :string, required: true
        parameter name: :parent_type, in: :path, type: :string, required: true
        
        parameter name: :attachment, in: :body, required: true, description: 'Attachment fields' do
          schema do
            key :'$ref', :AttachmentInput
          end
        end

        response 200 do
          key :description, 'Attachment response'
          schema do
            key :'$ref', :responseOne_Attachment
          end
        end
        response 422, description: 'Unprocessable Resource' do
          schema do
            key :'$ref', :errors
          end
        end

        response :default do
          key :description, 'Unexpected error'
        end
      end
    end
    
    # GET /api/<parent_type>/<parent_id>/attachments/created.json
    def create
      @attachment = Attachment.new(attachment_params)
      @attachment.persistent_file_id = @attachment.persistent_file_id.split('?').first.gsub("https://s3.amazonaws.com/#{ENV['S3_BUCKET_NAME']}/", '')
      @attachment.parent = parent
      authorize @attachment
      @attachment.owner = current_user

      if @attachment.save
        render json: @attachment
      else
        render json: @attachment, status: :unprocessable_entity
      end
    end

    private

    def attachment_params
      params.require(:attachment).permit(:persistent_file_id, :file_name, :file_size, :file_type)
    end
    
    def parent_type
      @parent_type ||= params[:parent_type]
    end
    
    def parent
      @parent ||= parent_type.constantize.unscoped.find(params["#{parent_type.underscore}_id"])
      authorize @parent, :show?
      @parent
    end
  end
end
