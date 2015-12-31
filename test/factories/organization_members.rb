FactoryGirl.define do
  factory :organization_member_without_owner, class: 'OrganizationMember' do
    organization factory: :organization_without_owner
    member factory: :user #_without_organization
  end

  factory :organization_member, parent: :organization_member_without_owner do
    after(:create) do |organization_member, evaluator|
      evaluator.organization.update owner: evaluator.member
    end
  end
end
