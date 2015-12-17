class AddOrganizationOwnersAsConversationMembers < ActiveRecord::Migration
  def up
    Conversation.all.each{|c| ConversationMember.create(conversation: c, member: c.organization.owner) if c.conversation_members.size == 0}
  end

  def down

  end
end
