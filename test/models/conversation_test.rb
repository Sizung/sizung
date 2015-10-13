require 'test_helper'

class ConversationTest < ActiveSupport::TestCase
  test 'create valid conversation from factory' do
    conversation = FactoryGirl.create(:conversation)
    assert conversation.persisted?
    assert conversation.organization.persisted?
  end

  test 'complains when title is missing' do
    conversation = FactoryGirl.build(:conversation, title: nil)
    assert_not conversation.valid?
    assert_equal ["can't be blank"], conversation.errors.messages[:title]
  end
end
