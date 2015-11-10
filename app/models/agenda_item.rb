class AgendaItem < ConversationObject
  self.table_name = 'agenda_items'

  belongs_to :conversation
  belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'

  has_many :conversation_objects, foreign_key: :parent_id

  validates_presence_of :conversation, :owner, :title, :status
end
