class OrganizationChannel < ApplicationCable::Channel
  def follow(data)
    stop_all_streams
    stream_from "organizations:#{data['organization_id']}"
    current_user.appear
    logger.info "#{current_user} follows organizations:#{data['organization_id']}"
  end

  def unfollow
    stop_all_streams
  end

end
