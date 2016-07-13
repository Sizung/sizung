class UserSerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name, :name, :email, :presence_status, :created_at, :updated_at

  include Swagger::Blocks

  swagger_schema :User, type: :object do
    key :required, [:id, :type, :attributes]

    property :id, type: :string
    property :type, type: :string, enum: ['users']
    property :attributes, type: :object do
      property :id, type: :string
      property :email, type: :string
      property :first_name, type: :string
      property :last_name, type: :string
      property :name, type: :string
      property :presence_status, type: :string, enum: ['online', 'offline']
      property :created_at, type: :string, format: 'date-time'
      property :updated_at, type: :string, format: 'date-time'
    end
  end

  swagger_schema :responseOne_User do
    property :data do
      key :'$ref', :User
    end
  end

  
  swagger_schema :reference_User do
    property :data, required: [:id, :type] do
      property :id, type: :string
      property :type, type: :string, enum: ['users']
    end
  end
end
