class AgendaItem < ActiveRecord::Base
  include Archival

  belongs_to :conversation
  belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'

  has_many :deliverables, as: :parent, dependent: :destroy
  has_many :conversation_objects, foreign_key: :parent_id
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :unseen_objects

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
end
