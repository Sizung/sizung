module Api
  module V1
    class ConversationSerializer < ActiveModel::Serializer
      attributes :id, :title, :created_at, :updated_at, :archived, :archived_at
      has_many :conversation_members
      has_many :members
      belongs_to :organization
    end
  end
end
