class Deliverable < ActiveRecord::Base
  include Archival
  include HasUnseenObjects
  
  belongs_to :parent, polymorphic: true, counter_cache: true, touch: true
  belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'
  belongs_to :assignee, class_name: 'User', foreign_key: 'assignee_id'
  has_many :conversation_objects, foreign_key: :parent_id
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :unseen_objects
  has_many :timeline_users, as: :timeline, dependent: :destroy
  has_many :subscribed_timeline_users, -> { subscribed }, as: :timeline, class_name: 'TimelineUser'
  has_many :subscribers, through: :subscribed_timeline_users, source: :user
  
  validates_presence_of :parent, :owner, :title, :assignee, :status

  def deliverable
    self
  end

  def agenda_item
    parent if parent_type == 'AgendaItem'
  end
  
  def conversation
    parent_type == 'AgendaItem' ? agenda_item.conversation : parent
  end

  def organization
    conversation.organization
  end
end
