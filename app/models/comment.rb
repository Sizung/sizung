class Comment < ActiveRecord::Base
  belongs_to :conversation
  belongs_to :author, class_name: 'User', foreign_key: 'author_id'
  belongs_to :attachment, polymorphic: true

  validates_presence_of :conversation, :author
end
