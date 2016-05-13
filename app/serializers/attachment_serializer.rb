class AttachmentSerializer < ActiveModel::Serializer
  attributes :id, :persistent_file_id, :file_name, :file_size, :created_at, :updated_at, :archived, :archived_at
  belongs_to :parent
  belongs_to :owner

  include Swagger::Blocks

  swagger_schema :Attachment do
    key :required, [:id, :type, :attributes]

    property :id, type: :string
    property :type, type: :string, enum: ['attachments']
    property :attributes do
      key :type, :object

      property :persistent_file_id, type: :string
      property :file_name, type: :string
      property :file_size, type: :integer
      property :created_at, type: :datetime
      property :updated_at, type: :datetime
      property :archived, type: :boolean
    end
    property :relationships do
      property :owner do
        property :data do
          property :id, type: :string, required: true
          property :type, type: :string, required: true, enum: ['users']
        end
      end
      property :parent do
        property :data do
          property :id, type: :string, required: true
          property :type, type: :string, required: true, enum: ['conversations', 'agenda_items', 'deliverables'] # TODO: maybe also comments?
        end
      end
    end
  end

  swagger_schema :responseOne_Attachment do
    property :data do
      key :'$ref', :Attachment
    end
  end

  swagger_schema :responseMany_Attachment do
    property :data, type: :array do
      items do
        key :'$ref', :Attachment
      end
    end
  end

end
