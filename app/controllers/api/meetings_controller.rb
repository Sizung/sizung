module Api
  class MeetingsController < ApplicationController
    before_filter :authenticate_user!
    respond_to :json

    def create
      @memberIdList = params[:memberIdList]
      @parentType = params[:parent][:type]
      if @parentType === 'conversations' then
        @parent = Conversation.find_by(id: params[:parent][:id])
      elsif @parentType === 'agendaItems' then
        @parent = AgendaItem.find_by(id: params[:parent][:id])
      elsif @parentType === 'deliverables'
        @parent = Deliverable.find_by(id: params[:parent][:id])
      end
      @url = params[:url]
      @toList = []

      if @memberIdList && !@memberIdList.empty?
        @memberIdList.each do |member|
          user = User.find_by(id: member['id'])
          @toList.push user['email']
        end

        MeetingInvitationMailer.user_invited_to_meeting(current_user, @toList, @url, @parent).deliver_later
        render json: { message: 'Member(s) pinged successfully.'}
      else
        render json: { message: 'Select at least one or more member(s)'}
      end
    end
  end
end