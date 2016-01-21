class DeliverableRelayJob < ActiveJob::Base
  queue_as :default

  def perform(deliverable:, actor_id:, action:)
    logger.info('Broadcasting new deliverable')

    agenda_item = deliverable.agenda_item
    AgendaItemRelayJob.perform_later(agenda_item: agenda_item, actor_id: nil, action: 'update')

    ActionCable.server.broadcast "conversations:#{agenda_item.conversation_id}",
                                 payload: ActiveModel::SerializableResource.new(deliverable).serializable_hash,
                                 actor_id: actor_id,
                                 action: action
  end
end
