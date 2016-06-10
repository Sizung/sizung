require 'test_helper'

describe Comment do
  it 'must be valid' do
    comment = FactoryGirl.build :comment
    value(comment).must_be :valid?
  end

  it 'cleans unseen objects when destroyed' do
    conversation = FactoryGirl.create :conversation
    comment = FactoryGirl.create :comment, commentable: conversation
    UnseenObject.create(user: conversation.conversation_members.first.member, target: comment, conversation: conversation)

    expect {
      comment.destroy
    }.must_change 'UnseenObject.count', -1
  end

end
