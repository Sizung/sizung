class CommentRelayJob < ActiveJob::Base
  queue_as :default

  def perform(comment:, actor_id:, action:)
    logger.info('Broadcasting new comment')
    conversation_id = JSON.parse(comment)['conversation_id']
    ActionCable.server.broadcast "conversations:#{conversation_id}:comments",
                                 comment: JSON.parse(comment),
                                 actor_id: actor_id,
                                 action: action
  end
end
