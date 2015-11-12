class CommentRelayJob < ActiveJob::Base
  queue_as :default

  def perform(payload:, commentable_id:, commentable_type:, actor_id:, action:)
    logger.info('Broadcasting new comment')

    conversation_id = commentable_id
    if commentable_type == 'AgendaItem'
      conversation_id = commentable_type.constantize.find(commentable_id).conversation_id
    end

    ActionCable.server.broadcast "conversations:#{conversation_id}:comments",
                                 payload: JSON.parse(payload),
                                 actor_id: actor_id,
                                 action: action
  end
end
