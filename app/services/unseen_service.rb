class UnseenService
  def handle_with(object, actor)
    object.conversation.members.each do |user|
      unseen_object = UnseenObject.create_from!(object, user)
      UserRelayJob.perform_later(unseen_object, user.id, action: 'create')
    end
  end
end