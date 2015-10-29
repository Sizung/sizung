class CommentsChannel < ApplicationCable::Channel
  def follow(data)
    stop_all_streams
    stream_from "conversations:#{data['conversation_id']}:comments"
    logger.info "#{current_user} follows conversations:#{data['conversation_id']}:comments"
  end

  def unfollow
    stop_all_streams
  end
end