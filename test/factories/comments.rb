FactoryGirl.define do
  factory :comment do
    commentable factory: :conversation
    author factory: :user
    sequence(:body) {|n| "Comment-Body-#{n}"}
  end
end
