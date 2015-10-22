class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :confirmable, :lockable

  has_many :organization_members, foreign_key: 'member_id', dependent: :destroy
  has_many :organizations, through: :organization_members
  has_many :conversations, through: :organizations

  def name
    (first_name && last_name) ? [first_name, last_name].join(' ') : email
  end

  def to_s
    name
  end
end
