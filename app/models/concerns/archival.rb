module Archival
  extend ActiveSupport::Concern

  included do
    acts_as_paranoid column: :archived_at
  end

  def archived
    !!paranoia_destroyed?
  end

  # Toggles the archive state of the model
  #
  # Returns true only if the archive state was toggled
  def toggle_archive(should_archive)
    return false if should_archive.blank? || paranoia_destroyed? == should_archive

    if should_archive
      destroy
      UnseenService.new.remove(self)
    else
      restore(recursive: true)
    end

    true
  end
end