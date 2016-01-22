module Archival
  extend ActiveSupport::Concern

  included do
    acts_as_archival
  end

  def archived
    !!archived?
  end

  # Toggles the archive state of the model
  #
  # Returns true only if the archive state was toggled
  def toggle_archive(should_archive)
    return false if should_archive.blank? || archived? == should_archive

    if should_archive
      archive
      UnseenService.new.remove(self)
    else
      unarchive
    end

    true
  end
end