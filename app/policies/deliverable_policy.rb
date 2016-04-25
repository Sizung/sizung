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

  def show?
    user.conversation_members.where(conversation_id: record.conversation.id).exists?
  end

  def show_including_archived?
    user.conversation_members.where(conversation_id: record.conversation.id).unscoped.exists?
  end
  
  class Scope < Scope
    def resolve
      # TODO: find a way to scope floating deliverables so that we can use the policy scope again
      raise NotImplementedError
      # scope.joins(agenda_item: { conversation: :conversation_members}).where(conversation_members: { member_id: user.id })
    end
  end
end
