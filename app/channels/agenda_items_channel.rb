class AgendaItemsChannel < ApplicationCable::Channel
  def follow(data)
    stop_all_streams
    stream_from "conversations:#{data['conversation_id']}:agenda_items"
    logger.info "#{current_user} follows conversations:#{data['conversation_id']}:agenda_items"
  end

  def unfollow
    stop_all_streams
  end
end