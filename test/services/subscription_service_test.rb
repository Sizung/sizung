require 'test_helper'

class SubscriptionServiceTest < ActiveSupport::TestCase

  it 'subscribes user when mentioned' do
    author         = FactoryGirl.create :user
    mentioned_user = FactoryGirl.create :user
    conversation   = FactoryGirl.create
    comment        = FactoryGirl.create :comment, body: "This is a mention test for no one @[#{mentioned_user.name}](#{mentioned_user.id})", author: author, commentable: conversation
    event          = Event.new(:mentioned, comment, author)
    
    SubscriptionService.new.process(event)

    expect(SubscriptionService.new.subscribed?(conversation, mentioned_user)).must_equal true
  end

  it 'subscribes user when assigned to a deliverable' do
    
  end

  it 'subscribes user when assigned as an agenda_item owner' do
    
  end

  it 'subscribes user when writing on timeline' do
    
  end

  it 'subscribes user when creating an agenda_item' do
    
  end

  it 'subscribes user when creating a deliverable' do
    
  end

  class TimelineUser
    def self.ensure_subscription(timeline, user)

    end
  end
end
