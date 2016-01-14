class OrganizationMemberSerializer < ActiveModel::Serializer
  attributes :id
  belongs_to :organization
  belongs_to :member
end
