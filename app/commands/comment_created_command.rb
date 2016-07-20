class CommentCreatedCommand < ApplicationCommand
  attr_reader :comment

  def initialize(comment)
    super("#{comment.author} created a comment. comment_id: #{comment.id}")
    @comment = comment
  end

  def execute
    subscribe_author
    subscribe_mentioned_users
    create_unseen_objects
    broadcast
    notify_mentioned_users
    notify_subscribers
  end

  private

  def broadcast
    payload = ActiveModelSerializers::SerializableResource.new(comment).serializable_hash.to_json
    CommentRelayJob.perform_later(payload: payload, commentable_id: comment.commentable_id, commentable_type: comment.commentable_type, actor_id: comment.author.id, action: 'create')
  end
  
  def subscribe_author
    TimelineUser.ensure_subscription(timeline, comment.author)
  end
  
  def subscribe_mentioned_users
    mentioned_users.each do |user|
      TimelineUser.ensure_subscription(timeline, user)
    end
  end

  def create_unseen_objects
    UnseenService.new.handle_with(comment, comment.author)
  end

  def notify_mentioned_users
    mentioned_users.each do |mentioned_user|
      NotificationService.new.mentioned(mentioned_user, comment)
    end
  end

  def notify_subscribers
    (subscribers - mentioned_users - [comment.author]).each do |subscriber|
      NotificationService.new.new_comment(subscriber, comment)
    end
  end
  
  def mentioned_users
    comment.mentioned_users
  end

  def timeline
    comment.commentable
  end
  
  def subscribers
    timeline.subscribers
  end

  # not used but good idea
  # def add_unseen_event
  #   timeline_user.add_part(current_user, 'mentioned you')
  # end
end
