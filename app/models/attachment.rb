class Attachment < ActiveRecord::Base
  include Archival
  include HasUnseenObjects
  
  belongs_to :parent, polymorphic: true, touch: true
  belongs_to :owner, class_name: 'User'
  has_many :unseen_objects, as: :target
  
  validates_presence_of :parent, :owner, :file_name, :file_size, :persistent_file_id

  def file_url
    "#{ENV['SIZUNG_HOST']}/attachments/#{id}"
  end
end
