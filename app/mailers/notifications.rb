class Notifications < ApplicationMailer

  def mentioned(user, mentionable, actor, target_url)
    @user = user
    @actor = actor
    @mentionable = mentionable
    @parent_title = mentionable.parent.title
    @display_body = MentionsService.new.display_body(mentionable)
    @target_url = target_url
    subject = "#{actor.first_name} mentioned you"

    mail to: @user.email, subject: subject
  end
end
