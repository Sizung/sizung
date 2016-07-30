class DeliverableResolvedCommand < ApplicationCommand
  attr_reader :deliverable, :author
  
  def initialize(deliverable, author)
    @deliverable = deliverable
    @author      = author
  end

  def execute
    subscribe_author
    create_unseen_objects
    broadcast
    notify_subscribers
  end

  def subscribe_author
    TimelineUser.ensure_subscription(timeline, author)
  end

  def create_unseen_objects
    UnseenService.new.handle_with(deliverable, author)
  end

  def broadcast
    DeliverableRelayJob.perform_later(deliverable: deliverable, actor_id: author.id, action: 'update')
  end

  def notify_subscribers
    (subscribers - [author]).each do |user| 
      NotificationService.new.resolved_deliverable(user, deliverable, author)
    end
  end
  
  def timeline
    deliverable
  end

  def subscribers
    timeline.subscribers
  end
end
