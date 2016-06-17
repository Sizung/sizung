class DeviceSerializer < ActiveModel::Serializer
  attributes :id, :token
  belongs_to :user

  include Swagger::Blocks

  swagger_schema :Device do
    key :required, [:id, :type]

    property :id, type: :string
    property :type, type: :string, enum: ['devices']
    property :attributes, type: :object, required: [:token, :created_at, :updated_at] do
      property :token, type: :string
      property :created_at, type: :string, format: 'date-time'
      property :updated_at, type: :string, format: 'date-time'
    end
    property :relationships do
      property :owner, '$ref': :reference_User
    end
  end

  swagger_schema :responseOne_Device do
    property :data do
      key :'$ref', :Device
    end
  end
end
