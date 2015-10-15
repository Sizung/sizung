class Organization < ActiveRecord::Base
  belongs_to :owner, class_name: 'User'
  has_many :organization_members, dependent: :destroy
  has_many :members, through: :organization_members
  has_many :conversations, dependent: :destroy

  validates_presence_of :name

  DEFAULT_NAME = 'Default Organization Name'

  before_create :add_account_user_for_owner

  def add_account_user_for_owner
    organization_members.build(member: owner) if owner
    conversations.build(title: Conversation::DEFAULT_TITLE)
  end

  def to_s
    name
  end

end