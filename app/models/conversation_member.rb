class ConversationMember < ActiveRecord::Base
  belongs_to :conversation
  belongs_to :member, class_name: 'User', foreign_key: 'member_id'
  after_destroy :clean_unseen_objects

  validates :member_id, uniqueness: {scope: :conversation_id}

  def clean_unseen_objects
    UnseenObject.where(user: member, conversation: conversation).destroy_all
  end
  
end
