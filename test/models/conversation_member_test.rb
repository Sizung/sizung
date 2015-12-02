require 'test_helper'

describe ConversationMember do
  let(:conversation_member) { ConversationMember.new }

  it 'must be valid' do
    value(conversation_member).must_be :valid?
  end
end
