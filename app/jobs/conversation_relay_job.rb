class ConversationRelayJob < ActiveJob::Base
  queue_as :default

  def perform(conversation:, actor_id:, action:)
    ActionCable.server.broadcast "conversations:#{conversation.id}",
                                 payload: ActiveModel::SerializableResource.new(conversation).serializable_hash,
                                 actor_id: actor_id,
                                 action: action
  end
end
