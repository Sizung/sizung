class DeliverableCreatedJob < ActiveJob::Base
  queue_as :default

  def perform(deliverable, author)
    DeliverableCreatedCommand.new(deliverable, author).execute
  end
end
