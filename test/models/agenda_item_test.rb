require 'test_helper'

describe AgendaItem do
  it 'must be valid' do
    agenda_item = FactoryGirl.build :agenda_item
    value(agenda_item).must_be :valid?
  end

  it 'has a due_on date' do
    agenda_item = FactoryGirl.create :agenda_item, due_on: Date.today
    expect(agenda_item).must_be :persisted?
    expect(agenda_item.due_on).must_equal Date.today
  end

  it 'has a owner' do
    user        = FactoryGirl.create :unconfirmed_user_without_organization
    agenda_item = FactoryGirl.create :agenda_item, owner: user
    expect(agenda_item).must_be :persisted?
    expect(agenda_item.owner).must_equal user
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

  it 'cleans unseen objects when destroyed' do
    agenda_item = FactoryGirl.create :agenda_item
    UnseenObject.create(user: agenda_item.conversation.conversation_members.first.member, agenda_item: agenda_item)

    expect {
      agenda_item.destroy
    }.must_change 'UnseenObject.count', -1
  end

end
