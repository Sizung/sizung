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
  end

  private
  def invite_to_organization(existing_user, inviter, organization)
    existing_user.organization_members.create(organization: organization)
    InvitationMailer.existing_user_added_to_organization(existing_user, organization, inviter)
  end
end
