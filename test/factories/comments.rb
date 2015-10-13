FactoryGirl.define do
  factory :comment do
    conversation
    author factory: :user
    sequence(:body) {|n| "Comment-Body-#{n}"}
  end
end
