class CommentCreatedJob < ActiveJob::Base
  queue_as :default

  def perform(comment)
    CommentCreatedCommand.new(comment).execute
  end
end
