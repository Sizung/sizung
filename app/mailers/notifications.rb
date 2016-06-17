class Notifications < ApplicationMailer
  include Rails.application.routes.url_helpers

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

  def deliverable_assigned(deliverable, actor)
    @deliverable = deliverable
    @assignee    = deliverable.assignee
    @actor       = actor
    @target_url  = deliverable_url(deliverable)
    
    mail to: @deliverable.assignee.email, subject: "#{@actor.first_name} assigned an action to you"
  end
end
