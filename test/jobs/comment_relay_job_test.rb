require 'test_helper'

describe CommentRelayJob do
  it 'enqueued the job' do
    # comment = FactoryGirl.create :comment
    # assert_performed_with(job: BroadcastCommentCreatedJob, args: [comment, comment.author.id]) do
    #   BroadcastCommentCreatedJob.perform_later(comment: comment, actor_id: comment.author.id)
    # end
    # assert_enqueued_jobs 1
  end
end
