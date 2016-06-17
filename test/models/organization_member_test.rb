require 'test_helper'

class OrganizationMemberTest < ActiveSupport::TestCase
  test 'create valid organization_member from factory' do
    organization_member = FactoryGirl.create :organization_member
    assert organization_member.persisted?
    assert organization_member.member.persisted?
    assert organization_member.organization.persisted?
  end

  test 'can be an admin' do
    organization_member = FactoryGirl.create :organization_member, admin: true
    expect(organization_member).must_be :admin?
  end

  test 'by default it is not an admin' do
    organization_member = FactoryGirl.create :organization_member
    expect(organization_member).must_be :member_only?
  end
end
