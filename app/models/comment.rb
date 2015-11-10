class Comment < ConversationObject
  self.table_name = 'comments'

  belongs_to :commentable, polymorphic: true
  belongs_to :author, class_name: 'User', foreign_key: 'author_id'

  validates_presence_of :author, :commentable
end
