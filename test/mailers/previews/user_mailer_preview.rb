class UserMailerPreview < ActionMailer::Preview
  def confirmation_instructions
    UserMailer.confirmation_instructions(User.first, {})
  end

  def reset_password_instructions
    UserMailer.reset_password_instructions(User.first, {})
  end

  def unlock_instructions
    UserMailer.unlock_instructions(User.first, {})
  end

  def invitation_instructions
    resource = User.first
    token = "1234"
    UserMailer.invitation_instructions(resource, token)
  end
end
