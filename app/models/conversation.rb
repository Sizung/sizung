class Conversation < ActiveRecord::Base
  belongs_to :organization
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :agenda_items, dependent: :destroy
  has_many :deliverables, through: :agenda_items
  has_many :conversation_objects, foreign_key: :parent_id
  has_many :conversation_members, dependent: :destroy

  validates_presence_of :organization, :title

  DEFAULT_TITLE = 'general'

  def to_s
    title
  end
end
