class AgendaItemSerializer < ActiveModel::Serializer
  attributes :id, :title, :status, :due_on, :created_at, :updated_at, :comments_count, :deliverables_count, :archived, :archived_at
  belongs_to :conversation
  belongs_to :owner
  has_many :deliverables
  # has_many :time_tracks

  include Swagger::Blocks

  swagger_schema :AgendaItem do
    key :required, [:id, :type]

    property :id, type: :string
    property :type, type: :string, enum: ['agenda_items']
    property :attributes, type: :object, required: [:title, :status, :comments_count, :deliverables_count, :archived, :archived_at, :created_at, :updated_at] do
      property :title, type: :string
      property :status, type: :string
      property :due_on, type: :string, format: 'date'
      property :comments_count, type: :number, description: :deprecated
      property :deliverables_count, type: :number, description: :deprecated
      property :archived, type: :boolean
      property :archived_at, type: :string, format: 'date-time'
      property :created_at, type: :string, format: 'date-time'
      property :updated_at, type: :string, format: 'date-time'
    end
    property :relationships do
      property :owner, '$ref': :reference_User
      property :conversation, '$ref': :reference_Conversation

      property :deliverables do
        property :data, type: :array do
          items do
            property :id, type: :string
            property :type, type: :string, enum: ['deliverables']
          end
        end
      end
    end
  end

  swagger_schema :reference_AgendaItem do
    property :data, required: [:id, :type] do
      property :id, type: :string
      property :type, type: :string, enum: ['agenda_items']
    end
  end
  
  swagger_schema :responseOne_AgendaItem do
    property :data do
      key :'$ref', :AgendaItem
    end
  end
end
