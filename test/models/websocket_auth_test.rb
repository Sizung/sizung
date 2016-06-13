require 'test_helper'

class WebsocketAuthTest < ActiveSupport::TestCase
  test 'can authenticate by jwt' do
    user  = FactoryGirl.create :unconfirmed_user_without_organization
    token = JsonWebToken.encode('user_id' => user.id)    
    expect(token).must_be :present?

    claims = ::JsonWebToken.decode(token)
    user_id = claims.fetch('user_id')
    expect(user_id).must_equal(user.id)
  end
end

