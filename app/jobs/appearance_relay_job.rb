class AppearanceRelayJob < ActiveJob::Base
  queue_as :default

  def perform(user:, actor_id:, action:)
    logger.info('Broadcasting new appearance')
    user.organizations.each do |organization|
      ActionCable.server.broadcast "organizations:#{organization.id}:members",
                                   user: user,
                                   actor_id: actor_id,
                                   action: action
    end
  end
end