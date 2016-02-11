class MeetingsController < ApplicationController
  def create
    @sender = User.find_by(email: params[:sender][:email])
    @memberIdList = params[:memberIdList]
    @parentType = params[:parent][:type]
    if @parentType === 'conversations' then
      @parent = Conversation.find_by(id: params[:parent][:id])
    elsif @parentType === 'agendaItems' then
      @parent = AgendaItem.find_by(id: params[:parent][:id])
    elsif @parentType === 'deliverables'
      @parent = Deliverable.find_by(id: params[:parent][:id])
    end
    puts 'parent: #{@parent}'
    @url = params[:url]
    @memberEmailArray = []
    @memberIdList.each do |member|
      user = User.find_by(id: member['id'])
      @memberEmailArray.push user['email']
    end
    if @sender && !@memberEmailArray.empty?
      MeetingInvitationMailer.user_invited_to_meeting(@sender, @memberEmailArray, @url, @parent).deliver_now
      render json: { message: 'Meeting Invitation Sent', status: 'success'}
    end
  end
end
