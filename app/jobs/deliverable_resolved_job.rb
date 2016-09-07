class DeliverableResolvedJob < ActiveJob::Base
  queue_as :default

  def perform(deliverable, author)
    DeliverableResolvedCommand.new(deliverable, author).execute
  end
end
