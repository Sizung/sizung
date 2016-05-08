module Api
  class ConversationsController < ApplicationController
    before_filter :authenticate_user!
    before_action :set_conversation, only: [:update, :destroy]
    before_action :set_organization, only: [:create, :index]
    after_action :verify_authorized,    except: :index
    after_action :verify_policy_scoped, only: :index

    respond_to :json

    include Swagger::Blocks
    
    swagger_path '/organizations/{organization_id}/conversations' do
      operation :get do
        key :summary, 'List conversations'
        key :description, 'Returns the list of conversations for a specific organization that the user is a member of'
        key :operationId, 'listConversationsByOrganizationId'
        key :tags, ['conversation']
        key :produces, ['application/json']
        
        response 200 do
          key :description, 'An array of conversations'
          schema do
            key :'$ref', :responseMany_Conversation
          end
        end
        response :default do
          key :description, 'Unexpected error'
        end
      end
    end
    
    # GET /conversations.json
    def index
      @conversations = policy_scope(Conversation).where(organization: @organization).order(:title)
      render json: @conversations
    end

    swagger_path '/conversations/{id}' do
      operation :get do
        key :summary, 'Details for a specific Conversatino'
        key :description, 'Returns the all details for a Conversation as well as the list of its Agenda Items and Deliverables'
        key :operationId, 'findConversationById'
        key :tags, ['conversation']
        key :produces, ['application/json']
        
        response 200 do
          key :description, 'Conversation response'
          schema do
            key :'$ref', :responseOne_Conversation
          end
        end
        response :default do
          key :description, 'Unexpected error'
        end
      end
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

      render json: @conversation, include: %w(agenda_items deliverables agenda_item_deliverables organization organization.organization_members.member conversation_members)
    end

    swagger_schema :ConversationInput do
      key :required, [:conversation]

      property :conversation, type: :object, required: [:name] do
        property :name, type: :string
        property :conversation_members, type: :array do
          items do
            property :member_id, type: :string
          end
        end
      end
    end

    swagger_path '/organizations/{organization_id}/conversations' do
      operation :post do
        key :summary, 'Create a new Conversation'
        key :description, 'Create a new Conversation within an Organization'
        key :operationId, 'createConversationByOrganizationId'
        key :tags, ['conversation']
        key :produces, ['application/json']

        parameter name: :conversation, in: :body, required: true, description: 'Conversation fields' do
          schema do
            key :'$ref', :ConversationInput
          end
        end

        response 200 do
          key :description, 'Conversation response'
          schema do
            key :'$ref', :responseOne_Conversation
          end
        end
        response :default do
          key :description, 'Unexpected error'
        end
      end
    end
    
    # POST /conversations.json
    def create
      @conversation = Conversation.new(conversation_params)
      authorize @conversation

      # creating conversation with conversation members
      if params[:conversation][:conversation_members]
        if @conversation.save
          @conversation.conversation_members.create(:conversation_id=>@conversation.id, :member_id=>current_user.id)
          params[:conversation][:conversation_members].each do |member|
            if member[:id] != ''
              @conversation.conversation_members.create(:conversation_id=>@conversation.id, :member_id=>member[:id])
            end
          end
          render json: @conversation, serializer: ConversationSerializer
        else
          render json: @conversation.errors, status: :unprocessable_entity
        end
      else
        #creating conversatin with just title without any conversation members
        if @conversation.save
          # TODO: Need to check if there is a better way of achieving the below case of adding conv creator as default member
          @conversation.conversation_members.create(:conversation_id=>@conversation.id, :member_id=>current_user.id)
          # render :show, status: :created, location: @conversation
          render json: @conversation, serializer: ConversationSerializer
        else
          render json: @conversation.errors, status: :unprocessable_entity
        end
      end
    end

    swagger_path '/conversations/{id}' do
      operation :patch do
        key :summary, 'Update a specific Conversation'
        key :description, 'Updates fields for a specific Conversation'
        key :operationId, 'updateConversationById'
        key :tags, ['conversation']
        key :produces, ['application/json']

        parameter name: :conversation, in: :body, required: true, description: 'Conversation fields to update' do
          schema do
            key :'$ref', :ConversationInput
          end
        end

        response 200 do
          key :description, 'Conversation response'
          schema do
            key :'$ref', :responseOne_Conversation
          end
        end
        response :default do
          key :description, 'Unexpected error'
        end
      end
    end

    # PATCH/PUT /conversations/1.json
    def update
      if @conversation.toggle_archive(params[:conversation][:archived]) || @conversation.update(conversation_params)
        ConversationRelayJob.perform_later(conversation: @conversation, actor_id: current_user.id, action: 'update')
        @addMembers = []
        @removeMembers = []
        if params[:conversation][:conversation_members]
          @conversation_members_params = params[:conversation][:conversation_members]
          params[:conversation][:conversation_members].each do |member|
            if !ConversationMember.find_by(conversation_id: @conversation.id, member_id: member[:member_id])
              @addMembers.push(member)
            end
          end
          @conversation.conversation_members.each do |existingMember|
            @filteredArray = params[:conversation][:conversation_members].select{|member| member[:member_id] == existingMember.member_id}
            if @filteredArray.empty?
              @removeMembers.push(existingMember)
            end
          end
          @addMembers.each do |member|
            @conversation.conversation_members.create(:conversation_id=>@conversation.id, :member_id=>member[:member_id])
          end
          @removeMembers.each do |member|
            @conversation.conversation_members.destroy(member)
          end
        end
        # TODO ANI GUGL: Fix this part while sending response to client so that client has control over which attributes to use
        render json: @conversation, include: %w(conversation_members)
      end
    end


    swagger_path '/conversations/{id}' do
      operation :delete do
        key :summary, 'Archive a specific Conversation'
        key :description, 'Archive a specific Conversation'
        key :operationId, 'archiveConversationById'
        key :tags, ['conversation']
        key :produces, ['application/json']

        response 200 do
          key :description, 'No content'
        end
        response :default do
          key :description, 'Unexpected error'
        end
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
      if params[:organization_id]
        @organization = policy_scope(Organization).find(params[:organization_id])
      elsif params[:conversation] && params[:conversation][:organization_id]
        @organization = policy_scope(Organization).find(params[:conversation][:organization_id])
      end
    end

    def set_conversation
      @conversation = Conversation.find(params[:id])
      authorize @conversation
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def conversation_params
      params.require(:conversation).permit(:title, :organization_id)
    end

    def update_conversation_params
      params.require(:conversation).permit(:title, :organization_id)
    end
  end
end
