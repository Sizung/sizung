require "test_helper"

describe ErrorsController do
  it "should get not_found" do
    get :not_found
    # value(response).must_be :success?
    assert response
    assert_match '404 Error', response.body
  end

  it "should get unacceptable" do
    get :unacceptable
    # value(response).must_be :success?
    assert response
    assert_match '422 Error', response.body
  end

  it "should get internal_error" do
    get :internal_error
    # value(response).must_be :success?
    assert response
    assert_match '500 Error', response.body
  end

end
