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

  def remove(object)
    unless [Conversation, AgendaItem, Deliverable, Comment].include? object.class
      raise ArgumentError.new('Unseen Objects can only be removed for AgendaItems, Deliverables and Comments')
    end

    unseen_objects = case object
      when Comment
        UnseenObject.all.where(target: object)
      else
        UnseenObject.all.where("#{object.class.name.underscore}_id = ?", object.id)
    end

    unseen_objects.each do |unseen_object|
      ActionCable.server.broadcast "users:#{unseen_object.user_id}",
                                   payload: ActiveModelSerializers::SerializableResource.new(unseen_object).serializable_hash,
                                   action: 'delete'
    end
    unseen_objects.destroy_all
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
