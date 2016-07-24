class AddTimelineToExistingUnseenObjects < ActiveRecord::Migration
  def change
    UnseenObject.where(timeline: nil).each do |unseen_object|
      unseen_object.update(timeline: unseen_object.try(:target).try(:timeline))
    end
  end
end
