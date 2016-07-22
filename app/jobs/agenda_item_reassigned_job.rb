class AgendaItemReassignedJob < ActiveJob::Base
  queue_as :default

  def perform(agenda_item, old_owner, author)
    AgendaItemReassignedCommand.new(agenda_item, old_owner, author).execute
  end
end
