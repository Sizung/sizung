class OrganizationSerializer < ActiveModel::Serializer
  attributes :id, :name
  belongs_to :owner
  has_many :organization_members
  
  include Swagger::Blocks

  swagger_schema :Organization do
    key :required, [:id, :type, :attributes]

    property :id, type: :string
    property :type, type: :string, enum: ['organizations']
    property :attributes do
      key :type, :object

      property :name do
        key :type, :string
      end
    end
    property :relationships do
      property :owner do
        property :data, required: [:id, :type] do
          property :id, type: :string
          property :type, type: :string, enum: ['users']
        end
      end

      property :organization_members do
        property :data, type: :array do
          items do
            property :id, type: :string
            property :type, type: :string, enum: ['organization_members']
          end
        end
      end
    end
  end

  swagger_schema :responseOne_Organization do
    property :data do
      key :'$ref', :Organization
    end
  end

  swagger_schema :responseMany_Organization do
    property :data, type: :array do
      items do
        key :'$ref', :Organization
      end
    end
  end
end

