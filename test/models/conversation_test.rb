require 'test_helper'

class ConversationTest < ActiveSupport::TestCase
  test 'create valid conversation from factory' do
    conversation = FactoryGirl.create :conversation
    assert conversation.persisted?
    assert conversation.organization.persisted?
  end
end
