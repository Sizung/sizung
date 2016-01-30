class AgendaItemSerializer < ActiveModel::Serializer
  attributes :id, :title, :status, :created_at, :updated_at, :comments_count, :deliverables_count, :archived, :archived_at
  belongs_to :conversation
  belongs_to :owner
  has_many :deliverables
end
