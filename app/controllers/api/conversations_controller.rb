module Api
  class ConversationsController < ApplicationController
    before_filter :authenticate_user!
    before_action :set_conversation, only: [:update, :destroy]
    before_action :set_organization, only: [:create, :index]
    after_action :verify_authorized,    except: :index
    after_action :verify_policy_scoped, only: :index

    respond_to :json

    # GET /conversations.json
    def index
      @conversations = policy_scope(Conversation).where(organization: @organization).order(:title)
      render json: @conversations
    end

    # GET /conversations/1.json
    def show
      @conversation = Conversation.includes(
          { agenda_items: [:owner, :comments, :deliverables] },
          { deliverables: [:owner, :assignee, :comments] },
          { organization: { organization_members: :member }},
          :conversation_members
      ).find(params[:id])
      authorize @conversation

      render json: @conversation, include: %w(agenda_items deliverables organization organization.organization_members.member conversation_members)
    end

    # POST /conversations.json
    def create
      @conversation = Conversation.new(conversation_params)
      authorize @conversation

      if @conversation.save
        # TODO: Need to check if there is a better way of achieving the below case of adding conv creator as default member
        @conversation.conversation_members.create(:conversation_id=>@conversation.id, :member_id=>current_user.id)
        render :show, status: :created, location: @conversation
      else
        render json: @conversation.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /conversations/1.json
    def update
      if @conversation.update(conversation_params)
        ConversationRelayJob.perform_later(conversation: @conversation, actor_id: current_user.id, action: 'update')
        render json: @conversation
      end
    end

    # DELETE /conversations/1.json
    def destroy
      @conversation.destroy
      head :no_content
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_organization
        @organization = policy_scope(Organization).find(params[:organization_id])
      end

      def set_conversation
        @conversation = Conversation.find(params[:id])
        authorize @conversation
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def conversation_params
        params.require(:conversation).permit(:title, :organization_id)
      end
  end
end
