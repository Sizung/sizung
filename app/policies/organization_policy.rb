class OrganizationPolicy < ApplicationPolicy
  def create?
    true
  end

  def update?
    show?
    # user == record.owner
  end

  def destroy?
    update?
  end

  class Scope < Scope
    def resolve
      user.organizations
    end
  end
end
