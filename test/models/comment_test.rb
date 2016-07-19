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

  it 'returns all mentioned users for a comment' do
    user1 = FactoryGirl.create :user
    user2 = FactoryGirl.create :user
    comment = FactoryGirl.build :comment, body: "Hi @[#{user1.name}](#{user1.id}) and @[#{user2.name}](#{user2.id}). How are you doing?"
    expect(comment.mentioned_users).must_equal [user1, user2]
  end
end
