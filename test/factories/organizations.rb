FactoryGirl.define do
  factory :organization_without_owner, class: 'Organization' do
    sequence(:name) { |n| "Organization-#{n}" }
  end

  factory :organization, parent: :organization_without_owner do
    after(:create) do |organization, evaluator|
      organization.update! owner: FactoryGirl.create(:user_without_organization, organizations: [organization])
    end
  end

end
