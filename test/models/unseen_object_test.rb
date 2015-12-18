require "test_helper"

describe UnseenObject do
  let(:unseen_object) { UnseenObject.new }

  it "must be valid" do
    value(unseen_object).must_be :valid?
  end
end
