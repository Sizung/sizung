class OrganizationMemberRelayJob < ActiveJob::Base
  queue_as :default

  def perform(organization_member:, actor_id:, action:)
    logger.info('Broadcasting new organization member')

    ActionCable.server.broadcast "organizations:#{organization_member.organization.id}",
      organization_member: ActiveModelSerializers::SerializableResource.new(organization_member, include: :member).serializable_hash,
      actor_id: actor_id,
      action: action
  end
end
