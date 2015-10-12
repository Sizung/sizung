require 'test_helper'

class OrganizationTest < ActiveSupport::TestCase
  test 'create valid organization from factory' do
    organization = FactoryGirl.create :organization
    assert organization.persisted?
    assert organization.owner.persisted?
  end
end
