class AgendaItem < ActiveRecord::Base
  include Archival
  include HasUnseenObjects

  belongs_to :conversation
  belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'
  belongs_to :traceable, polymorphic: true
  has_many :deliverables, as: :traceable
  has_many :agenda_items, as: :traceable
  has_many :deliverables, as: :parent, dependent: :destroy
  has_many :conversation_objects, foreign_key: :parent_id
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :unseen_objects
  has_many :timeline_users, as: :timeline, dependent: :destroy
  has_many :subscribed_timeline_users, -> { subscribed }, as: :timeline, class_name: 'TimelineUser'
  has_many :subscribers, through: :subscribed_timeline_users, source: :user
  
  validates_presence_of :conversation, :owner, :title, :status

  def deliverable
    nil
  end

  def agenda_item
    self
  end

  def organization
    conversation.organization
  end

  def parent
    conversation
  end

  def timeline
    self
  end

  def source_timeline
    traceable
  end
end
