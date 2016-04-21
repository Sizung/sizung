require 'test_helper'

describe CommentRelayJob do
  it 'enqueued the job' do
    # comment = FactoryGirl.create :comment
    # assert_performed_with(job: BroadcastCommentCreatedJob, args: [comment, comment.author.id]) do
    #   BroadcastCommentCreatedJob.perform_later(comment: comment, actor_id: comment.author.id)
    # end
    # assert_enqueued_jobs 1
  end

  it 'broadcasts to conversation' do
    conversation = FactoryGirl.create :conversation
    deliverable = FactoryGirl.create :deliverable, parent: conversation
    comment = FactoryGirl.create :comment, commentable: deliverable
    payload = ActiveModel::SerializableResource.new(comment).serializable_hash.to_json
    assert_performed_jobs 2 do
      CommentRelayJob.perform_later(payload: payload, commentable_id: comment.commentable_id, commentable_type: comment.commentable_type, actor_id: nil, action: 'create')
    end
  end
end
