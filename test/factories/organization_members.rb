FactoryGirl.define do
  factory :organization_member do
    organization factory: :organization_without_owner
    member factory: :user #_without_organization

    after(:create) do |organization_member, evaluator|
      evaluator.organization.update owner: evaluator.member
    end
  end
end
