class Conversation < ActiveRecord::Base
  belongs_to :organization
  has_many :comments

  validates_presence_of :organization, :title

  DEFAULT_TITLE = 'general'
end
