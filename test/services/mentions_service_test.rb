require 'test_helper'

class MentionsServiceTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  it 'enqueues mail for one mention' do
    user = FactoryGirl.create :user
    actor = FactoryGirl.create :user

    mentionable = FactoryGirl.create :comment, body: "This is a mention test for @[Sam Sample](#{user.id})"
    url = 'http://timeline.example.com'

    mentions_service = MentionsService.new

    assert_enqueued_jobs 1 do
      mentions_service.send_mails(mentionable,actor, url)
    end
  end

  it 'displays human readable text' do
    comment = FactoryGirl.build(:comment, body: 'This is a mention test for @[Sam Sample](123-456)')
    mentions_service = MentionsService.new

    expect(mentions_service.display_body(comment)).must_equal 'This is a mention test for Sam Sample'
  end

  it 'enqueues mail for two mentions' do
    user = FactoryGirl.create :user
    other_user = FactoryGirl.create :user
    actor = FactoryGirl.create :user

    mentionable = FactoryGirl.create :comment, body: "This is a mention test for @[Sam Sample](#{user.id}) and @[Other User](#{other_user.id})"
    url = 'http://timeline.example.com'

    mentions_service = MentionsService.new

    assert_enqueued_jobs 2 do
      expect(mentions_service.send_mails(mentionable, actor, url)).must_equal [user, other_user]
    end
  end

  it 'sends mail for one mention' do
    user = FactoryGirl.create :user
    actor = FactoryGirl.create :user

    mentionable = FactoryGirl.create :comment, body: "This is a mention test for @[Sam Sample](#{user.id})"
    url = 'http://timeline.example.com'

    mentions_service = MentionsService.new

    perform_enqueued_jobs do
      mentions_service.send_mails(mentionable, actor, url)
    end

    delivered_email = ActionMailer::Base.deliveries.last
    expect(delivered_email.subject).must_equal "#{actor.first_name} mentioned you"
  end

end
