class AgendaItem < ActiveRecord::Base
  belongs_to :conversation
  belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'

  validates_presence_of :conversation, :owner, :title, :status
end
