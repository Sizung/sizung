module Api
  class CommentsController < ApplicationController
    before_filter :authenticate_user!
    before_action :set_comment, only: [:update, :destroy]
    after_action :verify_authorized

    respond_to :json

    include Swagger::Blocks
    
    swagger_schema :CommentInput do
      key :required, [:comment]

      property :comment, type: :object, required: [:commentable_type, :commentable_id, :body] do
        property :commentable_type, type: :string, enum: ['deliverables', 'agenda_items', 'conversations']
        property :commentable_id, type: :string
        property :body, type: :string
      end
    end

    swagger_path '/comments' do
      operation :post, security: [bearer: []] do
        key :summary, 'Create a new Comment.'
        key :tags, ['comment']
        
        parameter name: :comment, in: :body, required: true, description: 'Comment fields' do
          schema do
            key :'$ref', :CommentInput
          end
        end

        response 200 do
          key :description, 'Comment response'
          schema do
            key :'$ref', :responseOne_Comment
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
    
    def create
      @comment = Comment.new(comment_params)
      authorize @comment
      @comment.author = current_user
      if @comment.save
        MentionedJob.perform_later(@comment, current_user, url_for(@comment.commentable))
        payload = ActiveModelSerializers::SerializableResource.new(@comment).serializable_hash.to_json
        CommentRelayJob.perform_later(payload: payload, commentable_id: @comment.commentable_id, commentable_type: @comment.commentable_type, actor_id: current_user.id, action: 'create')
        UnseenService.new.handle_with(@comment, current_user)
        render json: @comment, serializer: CommentSerializer
      else
        render json: @comment, status: 422, serializer: ActiveModel::Serializer::ErrorSerializer
      end
    end

    swagger_path '/comments/:id' do
      operation :patch, security: [bearer: []] do
        key :summary, 'Update an existing Comment.'
        key :tags, ['comment']

        parameter name: :id, in: :path, type: :string, required: true
        parameter name: :comment, in: :body, required: true, description: 'Comment fields' do
          schema do
            key :'$ref', :CommentInput
          end
        end

        response 200 do
          key :description, 'Comment response'
          schema do
            key :'$ref', :responseOne_Comment
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

    def update
      authorize @comment
      @comment.author = current_user
      old_body = @comment.body

      if @comment.toggle_archive(params[:comment][:archived]) || @comment.update(comment_params)
        MentionedJob.perform_later(@comment, current_user, url_for(@comment.commentable), old_body)
        payload = ActiveModelSerializers::SerializableResource.new(@comment).serializable_hash.to_json
        CommentRelayJob.perform_later(payload: payload, commentable_id: @comment.commentable_id, commentable_type: @comment.commentable_type, actor_id: current_user.id, action: 'update')
        render json: @comment, serializer: CommentSerializer
      else
        render json: @comment, status: 422, serializer: ActiveModel::Serializer::ErrorSerializer
      end
    end

    swagger_path '/comments/:id' do
      operation :delete, security: [bearer: []] do
        key :summary, 'Delete a Comment.'
        key :tags, ['comment']

        parameter name: :id, in: :path, type: :string, required: true

        response 200 do
          key :description, 'Comment response'
          schema do
            key :'$ref', :responseOne_Comment
          end
        end

        response :default do
          key :description, 'Unexpected error'
        end
      end
    end
    
    def destroy
      if @comment.really_destroy!
        UnseenService.new.remove(@comment)
        payload = ActiveModelSerializers::SerializableResource.new(@comment).serializable_hash.to_json
        CommentRelayJob.perform_later(payload: payload, commentable_id: @comment.commentable_id, commentable_type: @comment.commentable_type, actor_id: current_user.id, action: 'delete')
      end
      render json: @comment, serializer: CommentSerializer
    end
    
    private
      # Use callbacks to share common setup or constraints between actions.
      def set_comment
        @comment = Comment.find(params[:id])
        authorize @comment
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def comment_params
        params.require(:comment).permit(:commentable_id, :commentable_type, :author_id, :body)
      end
  end
end
