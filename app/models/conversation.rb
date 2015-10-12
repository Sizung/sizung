class Conversation < ActiveRecord::Base
  belongs_to :organization

  validates_presence_of :organization
end
