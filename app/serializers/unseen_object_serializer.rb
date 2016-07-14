class UnseenObjectSerializer < ActiveModel::Serializer
  attributes :id, :created_at, :updated_at
  belongs_to :organization
  belongs_to :conversation
  belongs_to :agenda_item
  belongs_to :deliverable
  belongs_to :target
  belongs_to :user

  include Swagger::Blocks

  swagger_schema :UnseenObject do
    key :required, [:id, :type]

    property :id, type: :string
    property :type, type: :string, enum: ['unseen_objects']
    property :attributes, type: :object, required: [:created_at, :updated_at] do
      property :created_at, type: :string, format: 'date-time'
      property :updated_at, type: :string, format: 'date-time'
    end
    property :relationships do
      property :user, '$ref': :reference_User
      property :deliverable, '$ref': :reference_Deliverable
      property :agenda_item, '$ref': :reference_AgendaItem
      property :conversation, '$ref': :reference_Conversation
      property :organization, '$ref': :reference_Organization
      
      property :target do
        property :id, type: :string
        property :type, type: :string, enum: ['conversations', 'agenda_items', 'deliverables', 'comments', 'attachments']
      end
    end
  end
  
  swagger_schema :responseOne_UnseenObject do
    property :data do
      key :'$ref', :UnseenObject
    end
  end

  swagger_schema :responseMany_UnseenObject do
    property :data, type: :array do
      items do
        key :'$ref', :UnseenObject
      end
    end
  end
end
