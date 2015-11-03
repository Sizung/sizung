class CommentsController < ApplicationController
  before_filter :authenticate_user!
  before_action :set_comment, only: [:destroy]
  after_action :verify_authorized

  respond_to :json

  # POST /comments.json
  def create
    @comment = Comment.new(comment_params)
    authorize @comment
    @comment.author = current_user
    @comment.save
    if @comment.persisted?
      CommentRelayJob.perform_later(comment: @comment.as_json(include: {author: {methods: :name}}).to_json, actor_id: current_user.id, action: 'create')
    end
    render json: @comment, serializer: CommentSerializer
  end

  # DELETE /comments/1.json
  def destroy
    if @comment.destroy
      CommentRelayJob.perform_later(comment: @comment.as_json(include: {author: {methods: :name}}).to_json, actor_id: current_user.id, action: 'delete')
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
      params.require(:comment).permit(:conversation_id, :author_id, :body)
    end
end
