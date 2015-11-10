class Conversation < ActiveRecord::Base
  belongs_to :organization
  has_many :comments, as: :commentable
  has_many :agenda_items
  has_many :conversation_objects, foreign_key: :parent_id

  validates_presence_of :organization, :title

  DEFAULT_TITLE = 'general'

  def to_s
    title
  end
end
