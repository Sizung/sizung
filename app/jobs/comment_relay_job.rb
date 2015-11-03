class CommentRelayJob < ActiveJob::Base
  queue_as :default

  def perform(payload:, conversation_id:, actor_id:, action:)
    logger.info('Broadcasting new comment')
    ActionCable.server.broadcast "conversations:#{conversation_id}:comments",
                                 payload: JSON.parse(payload),
                                 actor_id: actor_id,
                                 action: action
  end
end
