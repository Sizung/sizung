class ConversationSerializer < ActiveModel::Serializer
  attributes :id, :title, :created_at, :updated_at, :archived, :archived_at
  has_many :agenda_items
  has_many :deliverables
  has_many :agenda_item_deliverables
  has_many :conversation_members
  has_many :members
  belongs_to :organization

  include Swagger::Blocks

  swagger_schema :Conversation do
    key :required, [:id, :type, :attributes]

    property :id, type: :string
    property :type, type: :string, enum: ['conversations']
    property :attributes do
      key :type, :object

      property :title, type: :string
      property :created_at, type: :string, format: 'date-time'
      property :updated_at, type: :string, format: 'date-time'
      property :archived, type: :boolean
    end
    property :relationships do
      property :organization do
        property :data, required: [:id, :type] do
          property :id, type: :string
          property :type, type: :string, enum: ['organizations']
        end
      end

      property :agenda_items do
        property :data, type: :array do
          items do
            property :id, type: :string
            property :type, type: :string, enum: ['agenda_items']
          end
        end
      end

      property :deliverables do
        property :data, type: :array do
          items do
            property :id, type: :string
            property :type, type: :string, enum: ['deliverables']
          end
        end
      end

      property :agenda_item_deliverables do
        property :data, type: :array do
          items do
            property :id, type: :string
            property :type, type: :string, enum: ['deliverables']
          end
        end
      end

      property :conversation_members do
        property :data, type: :array do
          items do
            property :id, type: :string
            property :type, type: :string, enum: ['conversation_members']
          end
        end
      end

      property :members do
        property :data, type: :array do
          items do
            property :id, type: :string
            property :type, type: :string, enum: ['users']
          end
        end
      end
    end
  end

  swagger_schema :reference_Conversation do
    property :data, required: [:id, :type] do
      property :id, type: :string
      property :type, type: :string, enum: ['conversations']
    end
  end
  
  swagger_schema :responseOne_Conversation do
    property :data do
      key :'$ref', :Conversation
    end
  end

  swagger_schema :responseMany_Conversation do
    property :data, type: :array do
      items do
        key :'$ref', :Conversation
      end
    end
  end
end
