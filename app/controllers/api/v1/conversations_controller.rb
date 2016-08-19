module Api
  module V1
    class ConversationsController < Base
      before_filter :authenticate_user!
      before_action :set_organization,     only: [:create, :index]
      after_action  :verify_authorized,    except: :index
      after_action  :verify_policy_scoped, only: :index

      respond_to :json

      # GET /conversations.json
      def index
        @conversations = policy_scope(Conversation).where(organization: @organization).includes(:organization).order(:title)
        @conversations = @conversations.includes(:conversation_members) if params[:include] && params[:include].include?('conversation_members')
        @conversations = @conversations.includes(:members) if params[:include] && params[:include].include?('members')
        render json: @conversations,
               include: params[:include],
               each_serializer: Api::V1::ConversationSerializer
      end

      def show
        @conversation = policy_scope(Conversation)
        @conversation = @conversation.includes(:conversation_members) if params[:include] && params[:include].include?('conversation_members')
        @conversation = @conversation.includes(:members) if params[:include] && params[:include].include?('members')
        @conversation = @conversation.find(params[:id])
        authorize @conversation
        render json: @conversation,
               include: params[:include],
               serializer: Api::V1::ConversationSerializer
      end
      
      private
      def set_organization
        if params[:organization_id]
          @organization = policy_scope(Organization).find(params[:organization_id])
        elsif params[:conversation] && params[:conversation][:organization_id]
          @organization = policy_scope(Organization).find(params[:conversation][:organization_id])
        end
      end
    end
  end
end
