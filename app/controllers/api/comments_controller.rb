module Api
  class CommentsController < ApplicationController
    before_filter :authenticate_user!
    before_action :set_comment, only: [:update, :destroy]
    after_action :verify_authorized

    respond_to :json

    include Swagger::Blocks
    
    swagger_schema :CommentInput do
      key :required, [:comment]

      property :comment, type: :object, required: [:author_id, :body] do
        property :author_id, type: :string
        property :body, type: :string
      end
    end

    swagger_path '/{commentable_type}/{commentable_id}/comments' do
      operation :post, security: [bearer: []] do
        key :summary, 'Create a new Comment.'
        key :description, 'Creates a new comment'
        key :tags, ['comment']
        
        parameter name: :commentable_type, in: :path, type: :string, required: true
        parameter name: :commentable_id, in: :path, type: :string, required: true
        
        parameter name: :commentable, in: :body, required: true, description: 'Comment fields' do
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
    
    # POST /comments.json
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

    # DELETE /comments/1.json
    def destroy
      if @comment.really_destroy!
        UnseenService.new.remove(@comment)
        payload = ActiveModelSerializers::SerializableResource.new(@comment).serializable_hash.to_json
        CommentRelayJob.perform_later(payload: payload, commentable_id: @comment.commentable_id, commentable_type: @comment.commentable_type, actor_id: current_user.id, action: 'delete')
      end
      render json: @comment, serializer: CommentSerializer
    end

    # PATCH/PUT /comments/1.json
    def update
      authorize @comment
      @comment.author = current_user
      old_body = @comment.body

      if @comment.toggle_archive(params[:comment][:archived]) || @comment.update(comment_params)
        MentionedJob.perform_later(@comment, current_user, url_for(@comment.commentable), old_body)
        payload = ActiveModelSerializers::SerializableResource.new(@comment).serializable_hash.to_json
        CommentRelayJob.perform_later(payload: payload, commentable_id: @comment.commentable_id, commentable_type: @comment.commentable_type, actor_id: current_user.id, action: 'update')
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
