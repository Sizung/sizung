class OrganizationPolicy < ApplicationPolicy
  def create?
    true
  end

  def update?
    user.organizations.exists?(record.id)
  end

  def destroy?
    user == record.owner
  end

  def show_only_organization?
    user.organizations.exists?(record.id)
  end

  class Scope < Scope
    def resolve
      user.organizations
    end
  end
end
