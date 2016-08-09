class DeliverableArchivedJob < ActiveJob::Base
  queue_as :default

  def perform(deliverable, author)
    DeliverableArchivedCommand.new(deliverable, author).execute
  end
end
