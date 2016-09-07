class AgendaItemCreatedCommand < ApplicationCommand
  attr_reader :agenda_item, :author

  def initialize(agenda_item, author)
    @agenda_item = agenda_item
    @author      = author
  end

  def execute
    subscribe_author
    subscribe_owner unless agenda_item.owner == author
    create_unseen_objects
    broadcast
  end
  
  private
  
  def subscribe_author
    TimelineUser.ensure_subscription(timeline, author)
  end

  def subscribe_owner
    TimelineUser.ensure_subscription(timeline, agenda_item.owner)
  end

  def create_unseen_objects
    UnseenService.new.handle_with(agenda_item, author)
  end

  def broadcast
    AgendaItemRelayJob.perform_later(agenda_item: agenda_item, actor_id: author.id, action: 'create')
  end
  
  def timeline
    agenda_item
  end
end
