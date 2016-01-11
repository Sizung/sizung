class OrganizationSerializer < ActiveModel::Serializer
  attributes :id, :name
  has_many :organization_members
end
