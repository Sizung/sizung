class Conversation < ActiveRecord::Base
  belongs_to :organization

  validates_presence_of :organization, :title

  DEFAULT_TITLE = 'general'
end
