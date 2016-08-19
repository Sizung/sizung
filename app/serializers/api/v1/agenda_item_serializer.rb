module Api
  module V1
    class AgendaItemSerializer < ActiveModel::Serializer
      attributes :id, :title, :status, :due_on, :created_at, :updated_at, :archived, :archived_at
      belongs_to :conversation
      belongs_to :owner
    end    
  end
end

