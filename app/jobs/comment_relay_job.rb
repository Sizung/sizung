class CommentRelayJob < ActiveJob::Base
  queue_as :default

  def perform(comment)
    logger.info('Broadcasting new comment')
    ActionCable.server.broadcast "conversations:#{comment.conversation_id}:comments", comment: comment
  end
end
