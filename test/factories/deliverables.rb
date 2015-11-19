FactoryGirl.define do
  factory :deliverable do
    sequence(:title) {|n| "Deliverable-Title-#{n}"}
    agenda_item
    owner factory: :user
  end
end