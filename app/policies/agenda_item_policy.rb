class AgendaItemPolicy < ApplicationPolicy
  def create?
    true
  end

  def destroy?
    true
  end

  class Scope < Scope
    def resolve
      scope.joins(conversation: { organization: :organization_members }).where(organization_members: { member_id: user.id })
    end
  end
end
