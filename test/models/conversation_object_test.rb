require 'test_helper'

describe ConversationObject do
  it 'can list items' do
    assert_equal 0, ConversationObject.where(conversation_id: 'foo').size
  end

  it 'works as has_many relation for conversation' do
    conversation = FactoryGirl.create :conversation
    (1..10).each do |n|
      FactoryGirl.create :agenda_item, conversation: conversation, created_at: (DateTime.now - n.minutes)
      FactoryGirl.create :comment, commentable: conversation, created_at: (DateTime.now - n.minutes - n.seconds)
    end
    assert_equal 20, conversation.conversation_objects.size

    # really sorted with latest entry first to proof that the order by works
    assert conversation.conversation_objects[0].created_at > conversation.conversation_objects[1].created_at

    assert conversation.conversation_objects[0].kind_of?(ConversationObject)
    assert conversation.conversation_objects[1].kind_of?(ConversationObject)

    assert conversation.conversation_objects[0].kind_of?(AgendaItem)
    assert conversation.conversation_objects[1].kind_of?(Comment)
    assert_equal conversation, conversation.conversation_objects[1].commentable
  end
end
