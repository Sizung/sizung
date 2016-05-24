require 'test_helper'

describe UserMailer do
  it "Invitation for joining Organization contains the name of the right organization" do
    @user       = FactoryGirl.create :user
    @other_user = FactoryGirl.create :user
    @organization1 = FactoryGirl.create :organization
    @organization2 = FactoryGirl.create :organization
    @organization3 = FactoryGirl.create :organization
    @organization4 = FactoryGirl.create :organization
    @organization5 = FactoryGirl.create :organization
    mail = ''
    expect {
      mail = invite_to_organization(@user, @other_user, @organization1)
    }.must_change 'OrganizationMember.count', 1
    value(mail.body.encoded).must_match "You've been invited to join #{@organization1.name} on Sizung."
    expect {
      mail = invite_to_organization(@user, @other_user, @organization2)
    }.must_change 'OrganizationMember.count', 1
    value(mail.body.encoded).must_match "You've been invited to join #{@organization2.name} on Sizung."
    expect {
      mail = invite_to_organization(@user, @other_user, @organization3)
    }.must_change 'OrganizationMember.count', 1
    value(mail.body.encoded).must_match "You've been invited to join #{@organization3.name} on Sizung."
    expect {
      mail = invite_to_organization(@user, @other_user, @organization4)
    }.must_change 'OrganizationMember.count', 1
    expect {
      mail = invite_to_organization(@user, @other_user, @organization5)
    }.must_change 'OrganizationMember.count', 1
    value(mail.body.encoded).must_match "You've been invited to join #{@organization5.name} on Sizung."

  end

  private
    def invite_to_organization(user, other_user, organization)
      user.invite!(other_user) do |u|
        u.organization_members.build(organization: organization)
      end
    end
end