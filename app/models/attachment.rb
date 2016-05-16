class Attachment < ActiveRecord::Base
  include Archival
  
  belongs_to :parent, polymorphic: true
  belongs_to :owner, class_name: 'User'

  validates_presence_of :parent, :owner, :file_name, :file_size, :persistent_file_id
end