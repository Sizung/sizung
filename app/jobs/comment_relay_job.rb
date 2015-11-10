class CommentRelayJob < ActiveJob::Base
  queue_as :default

  def perform(payload:, commentable_id:, commentable_type:, actor_id:, action:)
    logger.info('Broadcasting new comment')
    # TODO: Update so that it also can broadcast to other commentable types
    ActionCable.server.broadcast "conversations:#{commentable_id}:comments",
                                 payload: JSON.parse(payload),
                                 actor_id: actor_id,
                                 action: action
  end
end
