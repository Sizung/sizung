class ConversationPolicy < ApplicationPolicy
  def create?
    true
  end

  def update?
    true
  end

  def destroy?
    true
  end

  class Scope < Scope
    def resolve
      user.conversations
    end
  end
end
