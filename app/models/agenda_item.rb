class AgendaItem < ActiveRecord::Base
  belongs_to :conversation
  belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'

  has_many :conversation_objects, foreign_key: :parent_id
  has_many :comments, as: :commentable, dependent: :destroy

  validates_presence_of :conversation, :owner, :title, :status

  def comments_count
    comments.size
  end
end
