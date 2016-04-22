require 'test_helper'

describe OrganizationMemberRelayJob do
  it 'broadcasts to organization' do
    organization_member = FactoryGirl.create :organization_member
    
    assert_performed_jobs 1 do
      OrganizationMemberRelayJob.perform_later(organization_member: organization_member, actor_id: nil, action: 'create')
    end
  end
end
