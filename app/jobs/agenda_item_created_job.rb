class AgendaItemCreatedJob < ActiveJob::Base
  queue_as :default

  def perform(agenda_item, author)
    AgendaItemCreatedCommand.new(agenda_item, author).execute
  end
end
