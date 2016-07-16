class UnseenService
  def handle_with(object, actor)
    object.conversation.members.each do |user|
      if user != actor
        create(object, user)
      end
    end
  end

  def create(object, user)
    unseen_object = UnseenObject.create_from!(object, user)
    UserRelayJob.perform_later(unseen_object, user.id, 'create')
  end

  # Removes the unseen objects of the given object and all child objects
  def remove(object)
    unless [Conversation, AgendaItem, Deliverable, Comment, Attachment].include? object.class
      raise ArgumentError.new('Unseen Objects can only be removed for Conversations, AgendaItems, Deliverables, Comments and Attachments')
    end

    unseen_objects = case object
                     when Comment, Attachment
                       UnseenObject.all.where(target: object)
                     else
                       UnseenObject.all.where("#{object.class.name.underscore}_id = ?", object.id)
                     end

    broadcast_delete(unseen_objects)
    unseen_objects.destroy_all
  end

  def broadcast_delete(unseen_objects)
    unseen_objects.each do |unseen_object|
      ActionCable.server.broadcast "users:#{unseen_object.user_id}",
                                   payload: ActiveModelSerializers::SerializableResource.new(unseen_object).serializable_hash,
                                   action: 'delete'
    end
  end
  
  # Removes the unseen objects for the given timeline
  def remove_for_timeline(current_user, timeline)
    scope = current_user.unseen_objects
    unseen_objects_to_delete = case timeline.class.name
                               when 'Conversation'
                                 scope.where(conversation: timeline).where("(target_type = 'Attachment' AND agenda_item_id IS NULL AND deliverable_id IS NULL) OR target_type = 'Conversation' OR target_type = 'AgendaItem' OR (target_type = 'Comment' AND agenda_item_id IS NULL AND deliverable_id IS NULL) ")
                               when 'AgendaItem'
                                 scope.where(agenda_item: timeline).where("(target_type = 'Attachment' AND deliverable_id IS NULL) OR target_type = 'AgendaItem' OR target_type = 'Deliverable' OR (target_type = 'Comment' AND deliverable_id IS NULL)")
                               when 'Deliverable'
                                 scope.where(deliverable: timeline)
                               else
                                 []
                               end
    if unseen_objects_to_delete.any?
      broadcast_delete(unseen_objects_to_delete)
      unseen_objects_to_delete.destroy_all
    end
    unseen_objects_to_delete
  end

  def movedDeliverable(deliverable, actor)
    unseen_objects = UnseenObject.all.where(deliverable: deliverable)
    unseen_objects.each do |unseen_object|
      unseen_object.update agenda_item_id: deliverable.agenda_item.try(:id)
      unseen_object.update conversation_id: deliverable.conversation.id
      ActionCable.server.broadcast "users:#{unseen_object.user_id}",
                                   payload: ActiveModelSerializers::SerializableResource.new(unseen_object).serializable_hash,
                                   action: 'update'
    end
  end
end
