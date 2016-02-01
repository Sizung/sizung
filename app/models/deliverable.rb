class Deliverable < ActiveRecord::Base
  include Archival

  belongs_to :agenda_item, counter_cache: true
  belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'
  belongs_to :assignee, class_name: 'User', foreign_key: 'assignee_id'

  has_many :conversation_objects, foreign_key: :parent_id
  has_many :comments, as: :commentable, dependent: :destroy

  validates_presence_of :agenda_item, :owner, :title, :assignee, :status

  def deliverable
    self
  end

  def conversation
    agenda_item.conversation
  end

  def organization
    conversation.organization
  end
end
