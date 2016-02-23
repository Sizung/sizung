require 'test_helper'

describe MentionedJob do
  it 'calls MentionService' do
    user = FactoryGirl.create :user
    mentionable = FactoryGirl.create :comment, body: "This is a mention test for @[Sam Sample](#{user.id})"
    actor = FactoryGirl.create :user
    MentionedJob.new.perform(mentionable, actor, 'http://some.url.example.com')
  end
end
