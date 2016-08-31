class OrganizationPolicy < ApplicationPolicy
  def create?
    true
  end

  def update?
    true
  end

  def destroy?
    user == record.owner
  end

  class Scope < Scope
    def resolve
      user.organizations
    end
  end
end
