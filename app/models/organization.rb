class Organization < ActiveRecord::Base
  belongs_to :owner, class_name: 'User'
  has_many :organization_members, dependent: :destroy
  has_many :members, through: :organization_members
  has_many :conversations, dependent: :destroy

  validates_presence_of :name

  DEFAULT_NAME = 'Default Organization Name'

  after_create :add_default_conversation

  def add_default_conversation
    conversation = conversations.create!(title: Conversation::DEFAULT_TITLE)
    conversation.conversation_members.create!(member: owner)
  end

  def to_s
    name
  end

end
