class UserChannel < ApplicationCable::Channel
  def subscribed
    logger.info "#{current_user} ONLINE"
    current_user.appear
  end

  def unsubscribed
    logger.info "#{current_user} OFFLINE"
    current_user.disappear
  end

  def appear(data)
    # current_user.appear on: data['appearing_on']
    logger.info "#{current_user} appeared on #{data['appearing_on']}"
    current_user.appear
  end

  def follow(data)
    stop_all_streams
    stream_from "users:#{data['user_id']}"
    logger.info "#{current_user} follows users:#{data['user_id']}"
  end

  def unfollow
    stop_all_streams
  end
end
