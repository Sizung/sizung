require "test_helper"

describe Device do
  let(:device) { FactoryGirl.build :device }

  it "must be valid" do
    value(device).must_be :valid?
  end
end
