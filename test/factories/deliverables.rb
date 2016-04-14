FactoryGirl.define do
  factory :deliverable do
    sequence(:title) {|n| "Deliverable-Title-#{n}"}
    parent factory: :agenda_item
    owner factory: :user
    assignee factory: :user
  end
end
