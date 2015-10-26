class Comment < ActiveRecord::Base
  belongs_to :conversation
  belongs_to :author, class_name: 'User', foreign_key: 'author_id'

  validates_presence_of :conversation, :author

  after_create { CommentRelayJob.perform_later(self) }
end
