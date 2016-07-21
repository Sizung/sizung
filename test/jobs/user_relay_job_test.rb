require 'test_helper'
require 'support/json_helpers'

describe UserRelayJob do
  it 'ability to broadcast an unseen object' do
    user          = FactoryGirl.create :user
    agenda_item   = FactoryGirl.create :agenda_item
    comment       = FactoryGirl.create :comment, commentable: agenda_item
    unseen_object = UnseenObject.create_from!(comment, user)

    json_payload = ActiveModelSerializers::SerializableResource.new(unseen_object, include: 'target,timeline').serializable_hash.to_json
    payload = JSON.parse(json_payload)
    expect(json_included(payload, 'type', 'agenda_items')).must_equal true
    expect(json_included(payload, 'type', 'comments')).must_equal true
  end
end
