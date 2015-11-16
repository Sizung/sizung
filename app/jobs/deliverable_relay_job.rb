class DeliverableRelayJob < ActiveJob::Base
  queue_as :default

  def perform(deliverable:, actor_id:, action:)
    logger.info('Broadcasting new deliverable')
    ActionCable.server.broadcast "conversations:#{deliverable.agenda_item.conversation_id}:deliverables",
                                 payload: ActiveModel::SerializableResource.new(deliverable).serializable_hash,
                                 actor_id: actor_id,
                                 action: action
  end
end
