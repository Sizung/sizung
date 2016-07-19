class Conversation < ActiveRecord::Base
  include Archival
  
  belongs_to :organization
  has_many :deliverables, as: :parent, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :agenda_item_deliverables, through: :agenda_items, source: :deliverables
  has_many :agenda_items, dependent: :destroy
  has_many :conversation_members, dependent: :destroy
  has_many :conversation_objects, foreign_key: :parent_id
  has_many :members, through: :conversation_members
  has_many :unseen_objects, dependent: :destroy
  has_many :timeline_users, as: :timeline, dependent: :destroy
  has_many :subscribed_timeline_users, -> { subscribed }, as: :timeline, class_name: 'TimelineUser'
  has_many :subscribers, through: :subscribed_timeline_users, source: :user
  
  validates_presence_of :organization, :title

  DEFAULT_TITLE = 'general'

  def deliverable
    nil
  end

  def agenda_item
    nil
  end

  def conversation
    self
  end

  def to_s
    title
  end
end
