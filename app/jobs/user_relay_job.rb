class UserRelayJob < ActiveJob::Base
  queue_as :default

  def perform(object, user_id, action)
    ActionCable.server.broadcast "users:#{user_id}",
                                 payload: ActiveModelSerializers::SerializableResource.new(object, include: 'target,timeline').serializable_hash,
                                 action: action
  end
end
