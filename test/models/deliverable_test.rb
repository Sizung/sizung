require 'test_helper'

describe Deliverable do

  it 'complains when parent is missing' do
    deliverable = FactoryGirl.build(:deliverable, parent: nil)
    value(deliverable).wont_be :valid?
    value(deliverable.errors.messages[:parent]).must_equal ["can't be blank"]
  end

  it 'complains when owner is missing' do
    deliverable = FactoryGirl.build(:deliverable, owner: nil)
    value(deliverable).wont_be :valid?
    value(deliverable.errors.messages[:owner]).must_equal ["can't be blank"]
  end

  it 'has conversation objects' do
    deliverable = FactoryGirl.create(:deliverable)
    comment = FactoryGirl.create(:comment, commentable: deliverable)
    value(deliverable.conversation_objects.to_a).must_equal [comment]
  end

  it 'can have an Agenda Item as parent' do
    agenda_item = FactoryGirl.create :agenda_item
    deliverable = FactoryGirl.create :deliverable, parent: agenda_item
    value(deliverable).must_be :valid?
    value(deliverable.agenda_item).must_equal agenda_item
    value(deliverable.conversation).must_equal agenda_item.conversation
  end

  it 'can have a Conversation as parent' do
    conversation = FactoryGirl.create :conversation
    deliverable = FactoryGirl.create :deliverable, parent: conversation
    value(deliverable).must_be :valid?
    value(deliverable.agenda_item).must_equal nil
    value(deliverable.conversation).must_equal conversation
  end
end
