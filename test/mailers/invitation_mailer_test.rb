require 'test_helper'
require 'support/email'

describe InvitationMailer do
  it "when the invited user already exists but did not confirm, there should be a confirm link in the email" do
    @unconfirmed_user = FactoryGirl.create :unconfirmed_user_without_organization
    @inviter          = FactoryGirl.create :user
    @organization     = FactoryGirl.create :organization

    mail = invite_to_organization(@unconfirmed_user, @inviter, @organization)

    value(mail.body.encoded).must_match "An account has already been created with this email address."
    value(mail.body.encoded).must_match "Please click here to confirm the email address"
    value(mail.body.encoded).must_match 'Confirm'
    value(mail.body.encoded).wont_match 'Join'
  end

  it "when the invited user already existes and is confirmed, there should only a join button" do
    @user         = FactoryGirl.create :user_without_organization
    @inviter      = FactoryGirl.create :user
    @organization = FactoryGirl.create :organization

    mail          = invite_to_organization(@user, @inviter, @organization)

    value(mail.body.encoded).must_match 'Join'
    value(mail.body.encoded).wont_match 'Confirm'
  end
  
  private
  def invite_to_organization(existing_user, inviter, organization)
    existing_user.organization_members.create(organization: organization)
    InvitationMailer.existing_user_added_to_organization(existing_user, organization, inviter)
  end
end
