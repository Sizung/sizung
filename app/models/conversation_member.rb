class ConversationMember < ActiveRecord::Base
  belongs_to :conversation
  belongs_to :member, class_name: 'User', foreign_key: 'member_id'
end
