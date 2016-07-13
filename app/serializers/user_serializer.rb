class UserSerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name, :name, :email, :presence_status, :created_at, :updated_at

  include Swagger::Blocks

  swagger_schema :reference_User do
    property :data, required: [:id, :type] do
      property :id, type: :string
      property :type, type: :string, enum: ['users']
    end
  end
end
