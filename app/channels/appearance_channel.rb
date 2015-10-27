class AppearanceChannel < ApplicationCable::Channel
  def subscribed
    # current_user.appear
    logger.info "#{current_user} subscribed"
  end

  def unsubscribed
    current_user.disappear
  end

  def appear(data)
    # current_user.appear on: data['appearing_on']
    logger.info "#{current_user} appeared on #{data['appearing_on']}"
  end

  def away
    current_user.away
  end
end
