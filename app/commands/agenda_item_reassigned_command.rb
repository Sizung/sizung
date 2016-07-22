class AgendaItemReassignedCommand < ApplicationCommand
  attr_reader :agenda_item, :author, :old_owner

  # TODO: add separated new_owner to be more specific and don't create inconsistencies
  #       when the owner has changed again before this background job runs
  def initialize(agenda_item, old_owner, author)
    @agenda_item = agenda_item
    @author      = author
    @old_owner   = old_owner
  end

  def execute
    subscribe_author
    subscribe_new_owner unless agenda_item.owner == author
    create_unseen_objects
    broadcast
    notify_new_owner unless agenda_item.owner == author
    notify_old_owner unless old_owner == author
  end
  
  private
  
  def subscribe_author
    TimelineUser.ensure_subscription(timeline, author)
  end

  def subscribe_new_owner
    TimelineUser.ensure_subscription(timeline, agenda_item.owner)
  end

  def create_unseen_objects
    UnseenService.new.handle_with(agenda_item, author)
  end

  def notify_new_owner
    NotificationService.new.assigned_agenda_item(agenda_item, author)
  end

  def notify_old_owner
    NotificationService.new.unassigned_agenda_item(agenda_item, old_owner, author)
  end

  def broadcast
    AgendaItemRelayJob.perform_later(agenda_item: agenda_item, actor_id: author.id, action: 'update')
  end
  
  def timeline
    agenda_item
  end
end
