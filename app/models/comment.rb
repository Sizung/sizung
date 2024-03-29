class Comment < ActiveRecord::Base
  include Archival
  include HasUnseenObjects

  belongs_to :commentable, polymorphic: true, counter_cache: true, touch: true
  belongs_to :author, class_name: 'User', foreign_key: 'author_id'
  has_many :unseen_objects, as: :target

  validates_presence_of :author, :commentable, :body

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

  def parent
    commentable
  end

  def timeline
    parent
  end
  
  def mentioned_users
    MentionsService.new.extract_users(body)
  end

  def display_body
    MentionsService.new.display_body(self)
  end
end
