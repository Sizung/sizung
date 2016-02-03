class AgendaItemPolicy < ApplicationPolicy
  def create?
    true
  end

  def update?
    show?
  end

  def destroy?
    show?
  end

  class Scope < Scope
    def resolve
      scope.joins(conversation: :conversation_members).where(conversation_members: { member_id: user.id })
    end
  end
end
