class TimelineUser < ActiveRecord::Base
  belongs_to :timeline, polymorphic: true
  belongs_to :user

  validates_presence_of :timeline, :user

  SUBSCRIPTION_LEVEL_TIMELINE = 'timeline'

  scope :subscribed, -> { where(subscription_level: SUBSCRIPTION_LEVEL_TIMELINE) }
  
  def self.ensure_subscription(timeline, user)
    timeline_user = TimelineUser.find_by(timeline: timeline, user: user)

    if timeline_user
      timeline_user.ensure_subscription
    else
      TimelineUser.create(timeline: timeline, user: user, subscription_level: SUBSCRIPTION_LEVEL_TIMELINE)      
    end
  end

  def ensure_subscription
    subscribed? ? self : update(subscription_level: SUBSCRIPTION_LEVEL_TIMELINE)
  end
  
  def subscribed?
    subscription_level.present?
  end
end
