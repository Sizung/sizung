class DeliverableReassignedCommand < ApplicationCommand
  attr_reader :deliverable, :author, :old_assignee

  # TODO: add separated new_assignee to be more specific and don't create inconsistencies
  #       when the assignee has changed again before this background job runs
  def initialize(deliverable, old_assignee, author)
    @deliverable  = deliverable
    @author       = author
    @old_assignee = old_assignee
  end

  def execute
    subscribe_author
    subscribe_new_assignee unless deliverable.assignee == author
    create_unseen_objects
    broadcast
    notify_new_assignee unless deliverable.assignee == author
    notify_old_assignee unless old_assignee == author
  end
  
  private
  
  def subscribe_author
    TimelineUser.ensure_subscription(timeline, author)
  end

  def subscribe_new_assignee
    TimelineUser.ensure_subscription(timeline, deliverable.assignee)
  end

  def create_unseen_objects
    UnseenService.new.handle_with(deliverable, author)
  end

  def notify_new_assignee
    NotificationService.new.assigned_deliverable(deliverable, author)
  end

  def notify_old_assignee
    NotificationService.new.unassigned_deliverable(deliverable, old_assignee, author)
  end

  def broadcast
    DeliverableRelayJob.perform_later(deliverable: deliverable, actor_id: author.id, action: 'update')
  end
  
  def timeline
    deliverable
  end
end
