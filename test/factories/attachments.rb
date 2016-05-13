FactoryGirl.define do
  factory :attachment do
    parent factory: :conversation
    owner factory: :user
    persistent_file_id "MyString"
    file_name "MyString.jpg"
    file_size 1
  end
end
