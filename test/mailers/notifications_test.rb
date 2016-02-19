require 'test_helper'

describe Notifications do
  it 'mentioned' do
    user = FactoryGirl.create :user
    actor = FactoryGirl.create :user
    mentionable = FactoryGirl.create :comment, body: "This is a mention test for @[Sam Sample](#{user.id})"
    mail = Notifications.mentioned(user, mentionable, actor, 'sampleurl.example.com')
    value(mail.subject).must_equal 'You got mentioned'
    value(mail.to).must_equal [user.email]
    value(mail.from).must_equal [ENV['EMAIL_FROM_ADDRESS']]
    value(mail.body.encoded).must_match "#{actor.name} mentioned you in"
    value(mail.body.encoded).must_match 'This is a mention test for Sam Sample'
    value(mail.body.encoded).must_match 'sampleurl.example.com'
  end
end
