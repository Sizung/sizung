class Notifications < ApplicationMailer
  include Rails.application.routes.url_helpers

  def mentioned(user, mentionable, actor, target_url)
    @user = user
    @actor = actor
    @mentionable = mentionable
    @parent_title = mentionable.parent.title
    @display_body = MentionsService.new.display_body(mentionable)
    @target_url = target_url
    subject = subject_for_mentions(actor, mentionable)
    mail to: @user.email, subject: subject
  end

  def deliverable_assigned(deliverable, actor)
    @deliverable = deliverable
    @assignee    = deliverable.assignee
    @actor       = actor
    @target_url  = deliverable_url(deliverable)
    conversation_title = deliverable.parent_type == 'AgendaItem' ? deliverable.parent.parent.title : deliverable.parent.title;
    mail to: @deliverable.assignee.email, subject: "#{@actor.first_name} assigned an action to you in #{conversation_title}"
  end

  def deliverable_unassigned(deliverable, old_assignee, actor)
    @deliverable  = deliverable
    @old_assignee = old_assignee
    @actor        = actor
    @target_url   = deliverable_url(deliverable)
    
    mail to: old_assignee.email, subject: "#{@actor.first_name} unassigned you from an action"
  end
  
  def agenda_item_assigned(agenda_item, actor)
    @agenda_item = agenda_item
    @owner       = agenda_item.owner
    @actor       = actor
    @target_url  = agenda_item_url(agenda_item)
    
    mail to: @owner.email, subject: "#{@actor.first_name} assigned a priority to you"
  end

  def agenda_item_unassigned(agenda_item, old_owner, actor)
    @agenda_item = agenda_item
    @old_owner   = old_owner
    @actor       = actor
    @target_url  = agenda_item_url(agenda_item)
    
    mail to: old_owner.email, subject: "#{@actor.first_name} unassigned you from a priority"
  end

  private
    def subject_for_mentions(actor, mentionable)
      timeline_title = mentionable.commentable.title
      case mentionable.commentable
        when AgendaItem
          conversation_title = mentionable.commentable.parent.title
          return "#{@actor.first_name} mentioned you about #{timeline_title} in #{conversation_title}"
        when Deliverable
          conversation_title = mentionable.commentable.parent_type == 'AgendaItem' ? mentionable.commentable.parent.parent.title : mentionable.commentable.parent.title;
          return "#{@actor.first_name} mentioned you about #{timeline_title} in #{conversation_title}"
        when Conversation
          return "#{@actor.first_name} mentioned you in #{timeline_title}"
      end
  end

end
