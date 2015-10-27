class CommentsChannel < ApplicationCable::Channel
  def follow(data)
    stop_all_streams
    stream_from "conversations:#{data['conversation_id']}:comments"
    logger.info 'Someone follows the comments stream'
  end

  def unfollow
    stop_all_streams
  end
end