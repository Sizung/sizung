require "test_helper"

describe Attachment do
  it "must be valid" do
    attachment = FactoryGirl.build :attachment
    expect(attachment).must_be :valid?
  end

  it "complains when parent is missing" do
    attachment = FactoryGirl.build :attachment, parent: nil
    expect(attachment).wont_be :valid?
  end

  it "complains when persistent_file_id is missing" do
    attachment = FactoryGirl.build :attachment, persistent_file_id: nil
    expect(attachment).wont_be :valid?
  end

  it "complains when owner is missing" do
    attachment = FactoryGirl.build :attachment, owner: nil
    expect(attachment).wont_be :valid?
  end

  it "complains when file_name is missing" do
    attachment = FactoryGirl.build :attachment, file_name: nil
    expect(attachment).wont_be :valid?
  end

  it "complains when file_size is missing" do
    attachment = FactoryGirl.build :attachment, file_size: nil
    expect(attachment).wont_be :valid?
  end

  it "generates a file_url" do
    attachment = FactoryGirl.create :attachment
    expect(attachment.file_url).must_be :present?
    expect(attachment.file_url).must_equal "#{ENV['SIZUNG_HOST']}/attachments/#{attachment.id}"
  end

  it "touches the parent object" do
    deliverable = FactoryGirl.create :deliverable
    old_updated_at = DateTime.now - 1.day
    deliverable.update!(updated_at: old_updated_at)
    deliverable.reload
    expect(deliverable.updated_at.to_i).must_equal(old_updated_at.to_i)
    attachment = Attachment.create(parent: deliverable, file_name: 'something', file_size: 1, owner: deliverable.owner, persistent_file_id: 'someurl.com')
    expect(deliverable.updated_at.to_i).wont_equal(old_updated_at.to_i)
  end

  it 'cleans unseen objects when destroyed' do
    conversation = FactoryGirl.create :conversation
    attachment = FactoryGirl.create :attachment, parent: conversation
    UnseenObject.create(user: conversation.conversation_members.first.member, target: attachment, conversation: conversation)

    expect {
      attachment.destroy
    }.must_change 'UnseenObject.count', -1
  end

end
