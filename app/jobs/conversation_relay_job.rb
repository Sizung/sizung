class ConversationRelayJob < ActiveJob::Base
  queue_as :default

  def perform(conversation:, actor_id:, action:)
    ActionCable.server.broadcast "organizations:#{conversation.organization.id}",
                                 payload: ActiveModel::SerializableResource.new(conversation, include: :conversation_members).serializable_hash,
                                 actor_id: actor_id,
                                 action: action
  end
end
