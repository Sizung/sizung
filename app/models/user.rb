class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :confirmable, :lockable

  has_many :organization_members, foreign_key: 'member_id', dependent: :destroy
  has_many :organizations, through: :organization_members
  has_many :conversations, through: :organizations

  validates_presence_of :first_name, :last_name

  def name
    [first_name, last_name].join(' ')
  end
end
