FactoryGirl.define do
  factory :agenda_item do
    conversation
    sequence(:title) {|n| "AgendaItem-Title-#{n}"}
    owner factory: :user
  end
end
