class NotificationService
  include Rails.application.routes.url_helpers

  # Mentioned: Push + Email
  def mentioned(user, comment)
    author = comment.author
    url    = timeline_url(comment.commentable)

    PushNotificationService.new.mentioned(user, comment)
    Notifications.mentioned(user, comment, author, url).deliver_later
  end




  # Assigned Agenda Item: Email
  def assigned_agenda_item(agenda_item, author)
    Notifications.agenda_item_assigned(agenda_item, author).deliver_later
  end

  # Unassigned Agenda Item: Email
  def unassigned_agenda_item(agenda_item, old_owner, author)
    Notifications.agenda_item_unassigned(agenda_item, old_owner, author).deliver_later
  end




  # Assigned Deliverable: Push + Email
  def assigned_deliverable(deliverable, author)
    PushNotificationService.new.assigned_deliverable(deliverable, author)
    Notifications.deliverable_assigned(deliverable, author).deliver_later
  end

  # Unassigned Deliverable: Email
  def unassigned_deliverable(deliverable, old_assignee, author)
    PushNotificationService.new.unassigned_deliverable(deliverable, old_assignee, author)
  end

  # Resolved Deliverable: Push
  def resolved_deliverable(user, deliverable, author)
    PushNotificationService.new.resolved_deliverable(user, deliverable, author)
  end

  # Archived Deliverable: Push
  def archived_deliverable(user, deliverable, author)
    PushNotificationService.new.archived_deliverable(user, deliverable, author)
  end



  # New Comment: Nothing
  def new_comment(user, comment)
    # We don't send push notifications on new comments for now
    # PushNotificationService.new.new_comment(user, comment)
  end

  private

  # TODO: remove the duplication between here and PushNotificationService#timeline_url
  def timeline_url(timeline)
    case timeline
    when AgendaItem
      agenda_item_url(timeline.id, host: ActionMailer::Base.default_url_options[:host])
    when Deliverable
      deliverable_url(timeline.id, host: ActionMailer::Base.default_url_options[:host])
    when Conversation
      conversation_url(timeline.id, host: ActionMailer::Base.default_url_options[:host])
    else
      raise ArgumentError, "Only urls to Conversations, Deliverables or AgendaItems are supported but got: #{timeline}"
    end
  end
end
