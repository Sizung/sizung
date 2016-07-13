class DeliverableSerializer < ActiveModel::Serializer
  attributes :id, :title, :status, :due_on, :created_at, :updated_at, :comments_count, :archived, :archived_at
  belongs_to :parent
  belongs_to :owner
  belongs_to :assignee

  include Swagger::Blocks

  swagger_schema :Deliverable do
    key :required, [:id, :type]

    property :id, type: :string
    property :type, type: :string, enum: ['agenda_items']
    property :attributes, type: :object, required: [:title, :status, :due_on, :comments_count, :archived, :archived_at, :created_at, :updated_at] do
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
      property :assignee, '$ref': :reference_User
      property :parent do
        property :data, required: [:id, :type] do
          property :id, type: :string
          property :type, type: :string, enum: ['conversations', 'agenda_items']
        end
      end
    end
  end

  swagger_schema :responseOne_Deliverable do
    property :data do
      key :'$ref', :Deliverable
    end
  end
end
