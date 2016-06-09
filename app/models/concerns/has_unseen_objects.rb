module HasUnseenObjects
  extend ActiveSupport::Concern

  included do
    has_many :unseen_objects
    after_destroy :clear_unseen_objects
  end

  def clear_unseen_objects
    unseen_objects.destroy_all
  end
end
