require 'test_helper'

describe MentionedJob do
  it 'calls MentionService' do
    user = FactoryGirl.create :user
    MentionedJob.new.perform("This is a mention test for @[Sam Sample](#{user.id})", 'http://some.url.example.com')
  end
end
