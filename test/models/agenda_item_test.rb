require 'test_helper'

describe AgendaItem do
  it 'must be valid' do
    agenda_item = FactoryGirl.build :agenda_item
    value(agenda_item).must_be :valid?
  end

  it 'complains when conversation is missing' do
    agenda_item = FactoryGirl.build(:agenda_item, conversation: nil)
    assert_not agenda_item.valid?
    assert_equal ["can't be blank"], agenda_item.errors.messages[:conversation]
  end

  it 'complains when owner is missing' do
    agenda_item = FactoryGirl.build(:agenda_item, owner: nil)
    assert_not agenda_item.valid?
    assert_equal ["can't be blank"], agenda_item.errors.messages[:owner]
  end

  it 'has conversation objects' do
    agenda_item = FactoryGirl.create(:agenda_item)
    comment = FactoryGirl.create(:comment, commentable: agenda_item)
    assert_equal [comment], agenda_item.conversation_objects.to_a
  end
end
