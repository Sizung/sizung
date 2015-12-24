class Comment < ActiveRecord::Base
  belongs_to :commentable, polymorphic: true
  belongs_to :author, class_name: 'User', foreign_key: 'author_id'

  validates_presence_of :author, :commentable

  def title
    body
  end

  def owner
    author
  end

  def deliverable
    commentable.deliverable
  end

  def agenda_item
    commentable.agenda_item
  end

  def conversation
    commentable.conversation
  end

  def organization
    commentable.organization
  end
end
