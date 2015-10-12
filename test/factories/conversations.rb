FactoryGirl.define do
  factory :conversation do
    sequence(:title) {|n| "Conversation-#{n}"}
    organization
  end

end
