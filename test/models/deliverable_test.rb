require 'test_helper'

describe Deliverable do

  it 'complains when conversation is missing' do
    deliverable = FactoryGirl.build(:deliverable, agenda_item: nil)
    value(deliverable).wont_be :valid?
    value(deliverable.errors.messages[:agenda_item]).must_equal ["can't be blank"]
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
end
