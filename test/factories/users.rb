FactoryGirl.define do
  factory :user_without_organization, class: 'User' do
    sequence (:email) { |n| "sam.sample.#{n}@example.com" }
    sequence (:first_name) { |n| "Sam-#{n}" }
    sequence (:last_name) { |n| "Sample-#{n}" }
    password 'SuperSecret'
    password_confirmation 'SuperSecret'
    confirmed_at { DateTime.now }
  end

  factory :user, parent: :user_without_organization do
    after(:create) do |user, evaluator|
      create(:organization_member, member: user)
    end
  end

end
