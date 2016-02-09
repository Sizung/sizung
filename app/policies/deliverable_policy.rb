class DeliverablePolicy < ApplicationPolicy
  def create?
    true
  end

  def destroy?
    show?
  end

  def update?
    show?
  end

  class Scope < Scope
    def resolve
      scope.joins(agenda_item: { conversation: :conversation_members}).where(conversation_members: { member_id: user.id })
    end
  end
end
