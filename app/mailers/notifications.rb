class Notifications < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.notifications.mentioned.subject
  #
  def mentioned(user, mentionable, actor, target_url)
    @user = user
    @actor = actor
    @mentionable = mentionable
    @parent_title = mentionable.parent.title
    @display_body = MentionsService.new.display_body(mentionable)
    @target_url = target_url

    mail to: @user.email
  end
end
