class AgendaItemRelayJob < ActiveJob::Base
  queue_as :default

  def perform(agenda_item:, actor_id:, action:)
    logger.info('Broadcasting new agenda_item')
    ActionCable.server.broadcast "conversations:#{agenda_item.conversation_id}:agenda_items",
                                 payload: ActiveModel::SerializableResource.new(agenda_item, include: [:initial_comment]).serializable_hash,
                                 actor_id: actor_id,
                                 action: action
  end
end
