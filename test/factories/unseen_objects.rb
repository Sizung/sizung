FactoryGirl.define do
  factory :unseen_object do
    organization nil
    conversation nil
    agenda_item nil
    deliverable nil
    timeline nil
    target factory: :comment
    user factory: :user
  end
end
