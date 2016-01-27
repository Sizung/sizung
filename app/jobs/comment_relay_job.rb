class CommentRelayJob < ActiveJob::Base
  queue_as :default

  def perform(payload:, commentable_id:, commentable_type:, actor_id:, action:)
    logger.info('Broadcasting new comment')

    conversation_id = commentable_id
    if commentable_type == 'AgendaItem'
      agenda_item = commentable_type.constantize.find(commentable_id)
      AgendaItemRelayJob.perform_later(agenda_item: agenda_item, actor_id: nil, action: 'update')
      conversation_id = agenda_item.conversation_id
    elsif commentable_type == 'Deliverable'
      deliverable = commentable_type.constantize.find(commentable_id)
      DeliverableRelayJob.perform_later(deliverable: deliverable, actor_id: nil, action: 'update')
      conversation_id = deliverable.agenda_item.conversation_id
    end

    ActionCable.server.broadcast "conversations:#{conversation_id}",
                                 payload: JSON.parse(payload),
                                 actor_id: actor_id,
                                 action: action
  end
end
