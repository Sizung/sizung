class OrganizationMember < ActiveRecord::Base
  belongs_to :organization
  belongs_to :member, class_name: 'User', foreign_key: 'member_id'

  validates :member_id, uniqueness: {scope: :organization_id}
end
