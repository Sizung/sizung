class Comment < ConversationObject
  self.table_name = 'comments'

  belongs_to :conversation
  belongs_to :author, class_name: 'User', foreign_key: 'author_id'

  validates_presence_of :conversation, :author
end
