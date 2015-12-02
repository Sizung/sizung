class ConversationMemberPolicy < ApplicationPolicy
  def create?
    user.organizations.exists?(record.conversation.organization_id) &&
      record.member.organizations.exists?(record.conversation.organization_id)
  end

  def destroy?
    user.organizations.exists?(record.conversation.organization_id) &&
      record.member.organizations.exists?(record.conversation.organization_id)
  end
end
