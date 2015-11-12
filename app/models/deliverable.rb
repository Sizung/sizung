class Deliverable < ActiveRecord::Base
  belongs_to :agenda_item
  belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'

  has_many :conversation_objects, foreign_key: :parent_id
  has_many :comments, as: :commentable, dependent: :destroy

  validates_presence_of :agenda_item, :owner, :title

  def comments_count
    comments.size
  end
end
