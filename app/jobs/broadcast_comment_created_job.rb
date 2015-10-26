class BroadcastCommentCreatedJob < ActiveJob::Base
  queue_as :default

  def perform(comment:, actor_id:)
    logger.info('Broadcasting new comment')
    ActionCable.server.broadcast "conversations:#{comment.conversation_id}:comments",
                                 comment: comment.as_json(include: {author: {methods: :name}}),
                                 actor_id: actor_id
  end
end
