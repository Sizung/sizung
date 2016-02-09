class MovedDeliverableJob < ActiveJob::Base
  queue_as :default

  def perform(deliverable, actor)
    UnseenService.new.movedDeliverable(deliverable, actor)
  end
end
