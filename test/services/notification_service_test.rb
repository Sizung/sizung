require 'test_helper'

class NotificationServiceTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  it 'sends notifications to a users that has been mentioned in a conversation' do
    author  = FactoryGirl.create :user
    user    = FactoryGirl.create :user
    comment = FactoryGirl.create :comment, body: "This is a mention test for @[#{user.name}](#{user.id})", author: author
    
    notification_service = NotificationService.new

    perform_enqueued_jobs do
      notification_service.mentioned(user, comment)
    end

    delivered_email = ActionMailer::Base.deliveries.last
    expect(delivered_email.subject).must_equal "#{author.first_name} mentioned you"
  end

  it 'sends notifications to a users that has been mentioned in an agenda item' do
    author      = FactoryGirl.create :user
    user        = FactoryGirl.create :user
    agenda_item = FactoryGirl.create :agenda_item
    comment     = FactoryGirl.create :comment, commentable: agenda_item, body: "This is a mention test for @[#{user.name}](#{user.id})", author: author
    
    notification_service = NotificationService.new

    perform_enqueued_jobs do
      notification_service.mentioned(user, comment)
    end

    delivered_email = ActionMailer::Base.deliveries.last
    expect(delivered_email.subject).must_equal "#{author.first_name} mentioned you"
  end

  it 'sends notifications to a users that has been mentioned in an deliverable' do
    author      = FactoryGirl.create :user
    user        = FactoryGirl.create :user
    deliverable = FactoryGirl.create :deliverable
    comment     = FactoryGirl.create :comment, commentable: deliverable, body: "This is a mention test for @[#{user.name}](#{user.id})", author: author
    
    notification_service = NotificationService.new

    perform_enqueued_jobs do
      notification_service.mentioned(user, comment)
    end

    delivered_email = ActionMailer::Base.deliveries.last
    expect(delivered_email.subject).must_equal "#{author.first_name} mentioned you"
  end
end

