class UserSerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name, :name, :email, :presence_status, :created_at, :updated_at
end
