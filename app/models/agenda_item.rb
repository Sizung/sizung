class AgendaItem < ActiveRecord::Base
  include Archival

  belongs_to :conversation
  belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'

  has_many :deliverables, dependent: :destroy
  has_many :conversation_objects, foreign_key: :parent_id
  has_many :comments, as: :commentable, dependent: :destroy

  validates_presence_of :conversation, :owner, :title, :status

  def comments_count
    comments.size
  end

  def deliverables_count
    deliverables.size
  end

  def deliverable
    nil
  end

  def agenda_item
    self
  end

  def organization
    conversation.organization
  end
end
