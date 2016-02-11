class MeetingsController < ApplicationController
  def create
    @sender = User.find_by(email: params[:sender][:email])
    @memberIdList = params[:memberIdList]
    @url = params[:url]
    @memberEmailArray = []
    @memberIdList.each do |member|
      user = User.find_by(id: member['id'])
      @memberEmailArray.push user['email']
    end
    if @sender && !@memberEmailArray.empty?
      MeetingInvitationMailer.user_invited_to_meeting(@sender, @memberEmailArray, @url).deliver_now
      render json: { message: 'Meeting Invitation Sent', status: 'success'}
    end
  end
end
