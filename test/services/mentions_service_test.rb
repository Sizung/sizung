require 'test_helper'

class MentionsServiceTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  it 'enqueues mail for one mention' do
    user = FactoryGirl.create :user

    raw_body = "This is a mention test for @[Sam Sample](#{user.id})"
    url = 'http://timeline.example.com'

    mentions_service = MentionsService.new

    assert_enqueued_jobs 1 do
      mentions_service.send_mails(raw_body, url)
    end
  end

  it 'enqueues mail for two mentions' do
    user = FactoryGirl.create :user
    other_user = FactoryGirl.create :user

    raw_body = "This is a mention test for @[Sam Sample](#{user.id}) and @[Other User](#{other_user.id})"
    url = 'http://timeline.example.com'

    mentions_service = MentionsService.new

    assert_enqueued_jobs 2 do
      expect(mentions_service.send_mails(raw_body, url)).must_equal [user, other_user]
    end
  end

  it 'sends mail for one mention' do
    user = FactoryGirl.create :user

    raw_body = "This is a mention test for @[Sam Sample](#{user.id})"
    url = 'http://timeline.example.com'

    mentions_service = MentionsService.new


    perform_enqueued_jobs do
      mentions_service.send_mails(raw_body, url)
    end

    delivered_email = ActionMailer::Base.deliveries.last
    expect(delivered_email.subject).must_equal 'You got mentioned'
  end

end
