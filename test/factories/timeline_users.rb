FactoryGirl.define do
  factory :timeline_user do
    timeline factory: :conversation
    user
  end

end
