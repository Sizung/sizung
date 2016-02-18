class Notifications < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.notifications.mentioned.subject
  #
  def mentioned(user, target_url)
    @user = user
    @target_url = target_url

    mail to: @user.email
  end
end
