class OrganizationMemberPolicy < ApplicationPolicy
  def create?
    user.organizations.exists?(record.organization.id) &&
      !record.member.organizations.exists?(record.organization.id)
  end

  def destroy?
    user.organizations.exists?(record.organization.id) &&
      record.member.organizations.exists?(record.organization.id)
  end
end
