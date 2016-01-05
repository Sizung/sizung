class UnseenService
  def handle_with(object, actor)
    object.conversation.members.each do |user|
      if user != actor
        unseen_object = UnseenObject.create_from!(object, user)
        UserRelayJob.perform_later(unseen_object, user.id, 'create')
      end
    end
  end

  def remove(object)
    unless [AgendaItem, Deliverable, Comment].include? object.class
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
                                   payload: ActiveModel::SerializableResource.new(unseen_object).serializable_hash,
                                   action: 'delete'
    end
    unseen_objects.destroy_all
  end

  def moved(object, actor)
    unseen_objects = UnseenObject.all.where(target: object)
    unseen_objects.each do |unseen_object|
      ActionCable.server.broadcast "users:#{unseen_object.user_id}",
                                   payload: ActiveModel::SerializableResource.new(unseen_object).serializable_hash,
                                   action: 'delete'
    end
    unseen_objects.destroy_all

    handle_with(object, actor)
  end
end