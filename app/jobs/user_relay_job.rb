class UserRelayJob < ActiveJob::Base
  queue_as :default

  def perform(object, user_id, action)
    logger.info('Broadcasting new item to user')
    ActionCable.server.broadcast "users:#{user_id}",
                                 payload: ActiveModel::SerializableResource.new(object).serializable_hash,
                                 action: action
  end
end
