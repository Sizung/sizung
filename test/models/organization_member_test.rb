require 'test_helper'

class OrganizationMemberTest < ActiveSupport::TestCase
  test 'create valid organization_member from factory' do
    organization_member = FactoryGirl.create :organization_member
    assert organization_member.persisted?
    assert organization_member.member.persisted?
    assert organization_member.organization.persisted?
  end
end
