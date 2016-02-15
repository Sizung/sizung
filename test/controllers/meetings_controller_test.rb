require "test_helper"

describe MeetingsController do
  it "should get create" do
    get :create
    value(response).must_be :success?
  end

end
