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
end
