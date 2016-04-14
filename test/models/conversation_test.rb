require 'test_helper'

describe Deliverable do
  it 'create valid conversation from factory' do
    conversation = FactoryGirl.create(:conversation)
    assert conversation.persisted?
    assert conversation.organization.persisted?
  end

  it 'complains when title is missing' do
    conversation = FactoryGirl.build(:conversation, title: nil)
    assert_not conversation.valid?
    assert_equal ["can't be blank"], conversation.errors.messages[:title]
  end

  it 'creates an organization and organization_member' do
    conversation = FactoryGirl.create(:conversation)
    expect(conversation.organization.organization_members.size).must_equal 1
    expect(conversation.organization.organization_members.first.member).must_equal conversation.organization.owner
  end

  it 'removes all agenda_items, deliverables and comments when it gets deleted' do
    conversation = FactoryGirl.create(:conversation)
    agenda_item  = FactoryGirl.create(:agenda_item, conversation: conversation)
    deliverable  = FactoryGirl.create(:deliverable, parent: agenda_item)
    deliverable.destroy

    expect{
      conversation.reload.destroy!
    }.must_change('Conversation.count', -1)
  end
end
