class ConversationChannel < ApplicationCable::Channel
  def follow(data)
    stop_all_streams
    stream_from "conversations:#{data['conversation_id']}"
    logger.info "#{current_user} follows conversations:#{data['conversation_id']}"
  end

  def unfollow
    stop_all_streams
  end
end