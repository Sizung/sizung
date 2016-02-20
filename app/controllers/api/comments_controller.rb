module Api
  class CommentsController < ApplicationController
    before_filter :authenticate_user!
    before_action :set_comment, only: [:update, :destroy]
    after_action :verify_authorized

    respond_to :json

    # POST /comments.json
    def create
      @comment = Comment.new(comment_params)
      authorize @comment
      @comment.author = current_user
      @comment.save!
      if @comment.persisted?
        MentionedJob.perform_later(@comment, current_user, url_for(@comment.commentable))
        payload = ActiveModel::SerializableResource.new(@comment).serializable_hash.to_json
        CommentRelayJob.perform_later(payload: payload, commentable_id: @comment.commentable_id, commentable_type: @comment.commentable_type, actor_id: current_user.id, action: 'create')
        UnseenService.new.handle_with(@comment, current_user)
      end
      render json: @comment, serializer: CommentSerializer
    end

    # DELETE /comments/1.json
    def destroy
      if @comment.really_destroy!
        UnseenService.new.remove(@comment)
        payload = ActiveModel::SerializableResource.new(@comment).serializable_hash.to_json
        CommentRelayJob.perform_later(payload: payload, commentable_id: @comment.commentable_id, commentable_type: @comment.commentable_type, actor_id: current_user.id, action: 'delete')
      end
      render json: @comment, serializer: CommentSerializer
    end

    # PATCH/PUT /comments/1.json
    def update
      authorize @comment
      @comment.author = current_user

      if @comment.toggle_archive(params[:comment][:archived]) || @comment.update(comment_params)
        payload = ActiveModel::SerializableResource.new(@comment).serializable_hash.to_json
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
