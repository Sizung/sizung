class DeliverableCreatedCommand < ApplicationCommand
  attr_reader :deliverable, :author

  def initialize(deliverable, author)
    @deliverable = deliverable
    @author      = author
  end

  def execute
    subscribe_author
    subscribe_assignee unless deliverable.assignee == author
    create_unseen_objects
    broadcast
    notify_assignee unless deliverable.assignee == author
  end
  
  private
  
  def subscribe_author
    TimelineUser.ensure_subscription(timeline, author)
  end

  def subscribe_assignee
    TimelineUser.ensure_subscription(timeline, deliverable.assignee)
  end

  def create_unseen_objects
    UnseenService.new.handle_with(deliverable, author)
  end

  def notify_assignee
    NotificationService.new.assigned_deliverable(deliverable, author)
  end

  def broadcast
    DeliverableRelayJob.perform_later(deliverable: deliverable, actor_id: author.id, action: 'create')
  end
  
  def timeline
    deliverable
  end
end
