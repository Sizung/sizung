class DeliverableArchivedCommand < ApplicationCommand
  attr_reader :deliverable, :author
  
  def initialize(deliverable, author)
    @deliverable = deliverable
    @author      = author
  end

  def execute
    subscribe_author
    broadcast
    notify_subscribers unless deliverable.resolved?
  end

  def subscribe_author
    TimelineUser.ensure_subscription(timeline, author)
  end

  def broadcast
    DeliverableRelayJob.perform_later(deliverable: deliverable, actor_id: author.id, action: 'update')
  end

  def notify_subscribers
    (subscribers - [author]).each do |user| 
      NotificationService.new.archived_deliverable(user, deliverable, author)
    end
  end
  
  def timeline
    deliverable
  end

  def subscribers
    timeline.subscribers
  end
end
