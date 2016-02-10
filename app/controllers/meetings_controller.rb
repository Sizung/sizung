class MeetingsController < ApplicationController
  def create
    @sender = User.find_by(email: params[:sender][:email])
    @memberEmailList = params[:memberEmailList]
    @url = params[:url]
    @memberEmailArray = []
    @memberEmailList.each do |member|
      @memberEmailArray.push member['email']
    end
    if @sender && !@memberEmailArray.empty?
      MeetingInvitationMailer.user_invited_to_meeting(@sender, @memberEmailArray, @url).deliver_now
    end
  end
end
