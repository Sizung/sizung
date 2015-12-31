FactoryGirl.define do
  factory :conversation_without_owner, class: 'Conversation' do
    sequence(:title) {|n| "Conversation-#{n}"}
    organization
  end

  factory :conversation, parent: :conversation_without_owner do
    after(:create) do |conversation, evaluator|
      conversation.conversation_members.create!(member: conversation.organization.owner)
    end
  end

end
