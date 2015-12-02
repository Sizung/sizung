FactoryGirl.define do
  factory :conversation_member do
    conversation
    member factory: :user
  end
end
