module Api
  class ConversationMembersController < ApplicationController
    before_filter :authenticate_user!
    after_action :verify_authorized

    respond_to :json

    # POST /conversation_members.json
    def create
      @conversation_member = ConversationMember.new(conversation_member_params)
      authorize @conversation_member
      @conversation_member.save
      UnseenService.new.create(@conversation_member.conversation, @conversation_member.member)
      render json: @conversation_member, serializer: ConversationMemberSerializer
    end

    # DELETE /conversation_members/1.json
    def destroy
      @conversation_member = ConversationMember.find(params[:id])
      authorize @conversation_member
      @conversation_member.destroy
      render json: @conversation_member, serializer: ConversationMemberSerializer
    end

    private
      def conversation_member_params
        params.require(:conversation_member).permit(:conversation_id, :member_id)
      end
  end
end
