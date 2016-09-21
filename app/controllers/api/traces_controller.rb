module Api
  class TracesController < ApplicationController

    def create
      params.require(:trace).permit(:type, :id)
      trace_type = params[:trace][:type]
      trace_id = params[:trace][:id]

      @trace_object = case trace_type
        when 'Conversation'
          Conversation.find(trace_id)
        when 'AgendaItem'
          AgendaItem.find(trace_id)
        when 'Deliverable'
          Deliverable.find(trace_id)
        else
          nil
      end

      puts "Params: #{params}"
      # puts "Trace Object: #{@trace_object}"
      trace_array = []
      current_trace_object = @trace_object
      # puts "Current Trace Object #{current_trace_object}"
      while current_trace_object.class.name != 'Organization' do
        # puts "Current object : #{current_trace_object.title || current_trace_object.name}"
        case current_trace_object.class.name
          when 'Conversation'
            # trace_array.push('( Conversation: ' + current_trace_object.organization.name + '>' + current_trace_object.title + ' )')
            trace_array.push(current_trace_object)
            current_trace_object = current_trace_object.organization
          when 'AgendaItem'
            # trace_array.push('( Agenda: ' + current_trace_object.conversation.organization.name + '>' + current_trace_object.conversation.title + '>' + current_trace_object.title + ' )')
            trace_array.push(current_trace_object)
            current_trace_object = current_trace_object.traceable
          when 'Deliverable'
            # trace_array.push('( Deliverable: ' + current_trace_object.conversation.organization.name + '>' + current_trace_object.conversation.title + '>' + current_trace_object.title + ' )')
            trace_array.push(current_trace_object)
            current_trace_object = current_trace_object.traceable
          else
            nil
        end
      end
      render json: trace_array
    end

    # private
    #   def get_parent_trace(current_object)
    #     trace = ''
    #     case current_object.class.name
    #       when 'Conversation'
    #
    #     end
    #   end
    # end
    end
end