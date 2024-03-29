require 'test_helper'

describe ConversationMember do
  let(:conversation_member) { ConversationMember.new }

  it 'must be valid' do
    value(conversation_member).must_be :valid?
  end

  it 'allowes to add a user to the conversation when you removed him before' do
    user = FactoryGirl.create :user
    conv = FactoryGirl.create :conversation
    conv_member = FactoryGirl.create :conversation_member, member: user, conversation: conv
    conv_member.destroy
    conv_member = FactoryGirl.create :conversation_member, member: user, conversation: conv

    expect(conv_member).must_be :valid?
  end

  it 'cleans unseen objects when destroyed' do
    conversation_member = FactoryGirl.create :conversation_member
    UnseenObject.create(user: conversation_member.member, conversation: conversation_member.conversation)
    expect {
      conversation_member.destroy
    }.must_change 'UnseenObject.count', -1
  end
  
end
