require "test_helper"

describe TimelineUser do
  let(:timeline_user) { FactoryGirl.create :timeline_user }

  it "must be valid" do
    value(timeline_user).must_be :valid?
  end

  it "must ensure_subscription" do
    expect(timeline_user).wont_be :subscribed?

    TimelineUser.ensure_subscription(timeline_user.timeline, timeline_user.user)

    expect(timeline_user.reload).must_be :subscribed?
  end
end
