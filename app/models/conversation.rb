class Conversation < ActiveRecord::Base
  belongs_to :organization
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :deliverables, through: :agenda_items
  has_many :agenda_items, dependent: :destroy
  has_many :conversation_members, dependent: :destroy
  has_many :conversation_objects, foreign_key: :parent_id
  has_many :members, through: :conversation_members
  has_many :unseen_objects, dependent: :destroy

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
