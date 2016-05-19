class CommentSerializer < ActiveModel::Serializer
  attributes :id, :body, :created_at, :updated_at
  belongs_to :author
  belongs_to :commentable

  include Swagger::Blocks

  swagger_schema :Comment, type: :object do
    key :required, [:id, :type, :attributes]

    property :id, type: :string
    property :type, type: :string, enum: ['comments']
    property :attributes do
      key :type, :object

      property :id, type: :string
      property :body, type: :string
      property :created_at, type: :string, format: 'date-time'
      property :updated_at, type: :string, format: 'date-time'
    end
    property :relationships do
      property :commentable do
        property :data, required: [:id, :type] do
          property :id, type: :string
          property :type, type: :string, enum: ['conversations', 'agenda_items', 'deliverables']
        end
      end
      property :author do
        property :data, required: [:id, :type] do
          property :id, type: :string
          property :type, type: :string, enum: ['users']
        end
      end
    end
  end

  swagger_schema :responseOne_Comment do
    property :data do
      key :'$ref', :Comment
    end
  end
end
