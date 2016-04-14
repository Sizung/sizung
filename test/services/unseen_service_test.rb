require 'test_helper'

class UnsenServiceTest < ActiveSupport::TestCase
  it 'handles a moved deliverable' do
    unseen_service = UnseenService.new
    deliverable = FactoryGirl.create :deliverable
    current_user = deliverable.conversation.members.first
    FactoryGirl.create :conversation_member, conversation: deliverable.agenda_item.conversation
    expect(deliverable.conversation.members.size).must_equal 2
    unseen_service.handle_with(deliverable, current_user)
    expect(deliverable.agenda_item.unseen_objects.size).must_equal 1

    comment = FactoryGirl.create :comment, commentable: deliverable, author: current_user
    unseen_service.handle_with(comment, current_user)
    expect(deliverable.agenda_item.unseen_objects.size).must_equal 2

    # Move the deliverable
    old_agenda_item = deliverable.agenda_item
    agenda_item = FactoryGirl.create :agenda_item, conversation: deliverable.conversation
    deliverable.update parent: agenda_item

    # Move UnseenObjects accordingly
    UnseenService.new.movedDeliverable(deliverable, current_user)

    expect(old_agenda_item.unseen_objects.size).must_equal 0
    expect(UnseenObject.where(deliverable: deliverable).size).must_equal 2
    expect(UnseenObject.where(agenda_item: agenda_item).size).must_equal 2
  end
end
