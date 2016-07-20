require "test_helper"

describe UnseenObject do
  let(:unseen_object) { UnseenObject.new }

  it "must be valid" do
    value(unseen_object).must_be :valid?
  end

  it 'markes it as subscribed if the user is subscribed to the timeline' do
    user          = FactoryGirl.create :user
    comment       = FactoryGirl.create :comment
    timeline_user = FactoryGirl.create :timeline_user, timeline: comment.timeline, user: user, subscription_level: TimelineUser::SUBSCRIPTION_LEVEL_TIMELINE
    
    unseen_object = UnseenObject.create_from!(comment, user)

    expect(unseen_object.subscribed).must_equal true
    expect(unseen_object.timeline).must_be :present?
    expect(unseen_object.timeline).must_equal comment.timeline
  end

  it 'markes it as unsubscribed if the user is not subscribed to the timeline' do
    user          = FactoryGirl.create :user
    comment       = FactoryGirl.create :comment
    timeline_user = FactoryGirl.create :timeline_user, timeline: comment.timeline, user: user, subscription_level: nil
    
    unseen_object = UnseenObject.create_from!(comment, user)

    expect(unseen_object.subscribed).must_equal false
    expect(unseen_object.timeline).must_be :present?
    expect(unseen_object.timeline).must_equal comment.timeline
  end

  it 'markes it as subscribed if the user is subscribed to the timeline for an agenda item' do
    user          = FactoryGirl.create :user
    agenda_item   = FactoryGirl.create :agenda_item
    comment       = FactoryGirl.create :comment, commentable: agenda_item
    timeline_user = FactoryGirl.create :timeline_user, timeline: comment.timeline, user: user, subscription_level: TimelineUser::SUBSCRIPTION_LEVEL_TIMELINE
    
    unseen_object = UnseenObject.create_from!(comment, user)

    expect(unseen_object.subscribed).must_equal true
    expect(unseen_object.timeline).must_be :present?
    expect(unseen_object.timeline).must_equal agenda_item
  end

end
