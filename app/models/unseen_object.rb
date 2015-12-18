class UnseenObject < ActiveRecord::Base
  belongs_to :organization
  belongs_to :conversation
  belongs_to :agenda_item
  belongs_to :deliverable
  belongs_to :target, polymorphic: true
  belongs_to :user

  def self.create_from!(object, user)
    self.create!  user: user,
                  target: object,
                  deliverable: object.deliverable,
                  agenda_item: object.agenda_item,
                  conversation: object.conversation,
                  organization: object.organization
  end
end