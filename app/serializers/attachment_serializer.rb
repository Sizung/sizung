class AttachmentSerializer < ActiveModel::Serializer
  attributes :id, :file_url, :file_name, :file_size, :file_type, :created_at, :updated_at, :archived, :archived_at
  belongs_to :parent
  belongs_to :owner

  include Swagger::Blocks

  swagger_schema :Attachment, type: :object do
    key :required, [:id, :type, :attributes]

    property :id, type: :string
    property :type, type: :string, enum: ['attachments']
    property :attributes do
      key :type, :object

      property :file_url, type: :string
      property :file_name, type: :string
      property :file_size, type: :integer
      property :file_type, type: :string
      property :created_at, type: :string, format: 'date-time'
      property :updated_at, type: :string, format: 'date-time'
      property :archived, type: :boolean
    end
    property :relationships do
      property :owner do
        property :data, required: [:id, :type] do
          property :id, type: :string
          property :type, type: :string, enum: ['users']
        end
      end
      property :parent do
        property :data, required: [:id, :type] do
          property :id, type: :string
          property :type, type: :string, enum: ['conversations', 'agenda_items', 'deliverables'] # TODO: maybe also comments?
        end
      end
    end
  end

  swagger_schema :responseOne_Attachment do
    property :data do
      key :'$ref', :Attachment
    end
  end
end
