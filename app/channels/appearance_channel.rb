class AppearanceChannel < ApplicationCable::Channel
  def subscribed
    logger.info "#{current_user} ONLINE"
    current_user.appear
  end

  def unsubscribed
    logger.info "#{current_user} ONLINE"
    current_user.disappear
  end

  def appear(data)
    # current_user.appear on: data['appearing_on']
    logger.info "#{current_user} appeared on #{data['appearing_on']}"
    current_user.appear
  end
end
