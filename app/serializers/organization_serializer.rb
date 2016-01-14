class OrganizationSerializer < ActiveModel::Serializer
  attributes :id, :name
  has_many :organization_members
  has_many :conversations
  has_many :agenda_items
  has_many :deliverables
end
