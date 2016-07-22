class DeliverableReassignedJob < ActiveJob::Base
  queue_as :default

  def perform(deliverable, old_assignee, author)
    DeliverableReassignedCommand.new(deliverable, old_assignee, author).execute
  end
end
