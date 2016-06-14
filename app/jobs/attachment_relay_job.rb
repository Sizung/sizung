class AttachmentRelayJob < ActiveJob::Base
  queue_as :default

  def perform(payload:, parent_id:, parent_type:, actor_id:, action:)
    logger.info('Broadcasting new attachment')

    conversation_id = parent_id
    
    if parent_type == 'AgendaItem'
      agenda_item = parent_type.constantize.find(parent_id)
      AgendaItemRelayJob.perform_later(agenda_item: agenda_item, actor_id: nil, action: 'update')
      conversation_id = agenda_item.conversation_id
    elsif parent_type == 'Deliverable'
      deliverable = parent_type.constantize.find(parent_id)
      DeliverableRelayJob.perform_later(deliverable: deliverable, actor_id: nil, action: 'update')
      conversation_id = deliverable.conversation.id
    end

    ActionCable.server.broadcast "conversations:#{conversation_id}",
                                 payload: JSON.parse(payload),
                                 actor_id: actor_id,
                                 action: action
  end
end
