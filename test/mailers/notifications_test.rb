require 'test_helper'

describe Notifications do
  it 'mentioned' do
    user = FactoryGirl.create :user
    mail = Notifications.mentioned(user, 'sampleurl.example.com')
    value(mail.subject).must_equal 'You got mentioned'
    value(mail.to).must_equal [user.email]
    value(mail.from).must_equal [ENV['EMAIL_FROM_ADDRESS']]
    value(mail.body.encoded).must_match 'You have been mentioned on Sizung'
  end
end
