class OrganizationMemberSerializer < ActiveModel::Serializer
  attributes :id
  attribute :admin?, key: :admin
  belongs_to :organization
  belongs_to :member

  include Swagger::Blocks

  swagger_schema :reference_User do
    property :data, required: [:id, :type] do
      property :id, type: :string
      property :type, type: :string, enum: ['users']
    end
  end

  swagger_schema :reference_Organization do
    property :data, required: [:id, :type] do
      property :id, type: :string
      property :type, type: :string, enum: ['organizations']
    end
  end
  
  swagger_schema :OrganizationMember do
    key :required, [:id, :type]

    property :id, type: :string
    property :type, type: :string, enum: ['organization_members']
    property :attributes, type: :object, required: [:admin] do
      property :admin, type: :boolean
    end

    property :relationships do
      property :member, '$ref': :reference_User
      property :organization, '$ref': :reference_Organization
    end
  end

  swagger_schema :responseOne_OrganizationMember do
    property :data do
      key :'$ref', :OrganizationMember
    end
  end
end
