class ConversationObject < ActiveRecord::Base
  self.primary_key = 'id'
  default_scope { order(created_at: :desc)}
end
