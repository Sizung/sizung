FactoryGirl.define do
  factory :device do
    user
    sequence (:token) { |n| "token-#{n}" }
  end
end
