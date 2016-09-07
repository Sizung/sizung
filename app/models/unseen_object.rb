class UnseenObject < ActiveRecord::Base
  belongs_to :organization
  belongs_to :conversation
  belongs_to :agenda_item
  belongs_to :deliverable
  belongs_to :target, polymorphic: true
  belongs_to :user
  belongs_to :timeline, polymorphic: true

  scope :subscribed,   -> { where(subscribed: true) }
  scope :unsubscribed, -> { where(subscribed: false) }

  default_scope { order(created_at: :desc)}
  
  def self.create_from!(object, user)
    subscribed = false

    subscribed = TimelineUser.where(timeline: object.timeline, user: user).where.not(subscription_level: nil).first
    self.create!  user: user,
                  target: object,
                  timeline: object.timeline,
                  subscribed: subscribed.present?,
                  deliverable: object.deliverable,
                  agenda_item: object.agenda_item,
                  conversation: object.conversation,
                  organization: object.organization
  end
end
