class AttachmentPolicy < ApplicationPolicy
  def create?
    true
  end

  def update?
    show?
  end

  def destroy?
    show?
  end

  def show?
    record.parent.conversation.members.include? user
  end
  
  class Scope < Scope
    def resolve
      # TODO: find a way to scope attachments so that we can use the policy scope again
      raise NotImplementedError
      # scope.joins(conversation: :conversation_members).where(conversation_members: { member_id: user.id })
    end
  end
end
