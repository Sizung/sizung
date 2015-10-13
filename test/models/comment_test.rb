require 'test_helper'

describe Comment do
  it 'must be valid' do
    comment = FactoryGirl.build :comment
    value(comment).must_be :valid?
  end
end
