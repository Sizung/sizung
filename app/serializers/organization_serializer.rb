class OrganizationSerializer < ActiveModel::Serializer
  attributes :id, :name
  belongs_to :owner
  has_many :organization_members
end
