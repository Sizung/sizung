class TimeTrack < ActiveRecord::Base
  belongs_to :chat, polymorphic: true, touch: true
  belongs_to :user

  validates_presence_of :chat, :user
end
