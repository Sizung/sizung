class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :confirmable, :lockable

  belongs_to :last_visited_organization, foreign_key: 'last_visited_organization_id', class_name: 'Organization'
  has_many :organization_members, foreign_key: 'member_id', dependent: :destroy
  has_many :organizations, through: :organization_members
  has_many :conversation_members, foreign_key: 'member_id',  dependent: :destroy
  has_many :conversations, through: :conversation_members
  has_many :unseen_objects, dependent: :destroy
  has_many :agenda_items, foreign_key: 'owner_id'
  has_many :deliverables, foreign_key: 'owner_id'
  has_many :comments, foreign_key: 'author_id'

  validates_presence_of :first_name, :last_name

  def appear
    update presence_status: 'online'
    AppearanceRelayJob.perform_later(user: self, actor_id: self.id, action: 'appear').enqueue wait: 2.seconds
  end

  def disappear
    update presence_status: 'offline'
    AppearanceRelayJob.perform_later(user: self, actor_id: self.id, action: 'disappear').enqueue wait: 2.seconds
  end

  def name
    (first_name.present? && last_name.present?) ? [first_name, last_name].join(' ') : email
  end

  def to_s
    name
  end
end
