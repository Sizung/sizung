class ConversationsController < ApplicationController
  before_filter :authenticate_user!
  before_action :set_conversation, only: [:edit, :update, :destroy]
  before_action :set_organization, only: [:new, :create, :index]
  after_action :verify_authorized,    except: :index
  after_action :verify_policy_scoped, only: :index
  layout 'conversation', only: [:show]

  # GET /conversations
  # GET /conversations.json
  def index
    @conversations = policy_scope(Conversation).where(organization: @organization).order(:title)
    respond_to do |format|
      format.html { redirect_to @organization }
      format.json { render json: @conversations }
    end
  end

  # GET /conversations/1
  # GET /conversations/1.json
  def show
    respond_to do |format|
      format.html do
        @conversation = Conversation.find(params[:id])
        authorize @conversation
        @organizations_json = ActiveModel::SerializableResource.new(policy_scope(Organization)).serializable_hash
        @users_json = ActiveModel::SerializableResource.new(@conversation.organization.members).serializable_hash

        render :show
      end
      format.json do
        @conversation = Conversation.includes(
            { agenda_items: [:owner, :comments, :deliverables] },
            { deliverables: [:owner, :assignee, :comments] },
            { organization: { organization_members: :member }},
            :conversation_members
        ).find(params[:id])
        authorize @conversation

        render json: @conversation, include: %w(agenda_items deliverables organization organization.organization_members.member conversation_members)
      end
    end
  end

  # GET /conversations/new
  def new
    @conversation = @organization.conversations.build
    authorize @conversation
  end

  # GET /conversations/1/edit
  def edit
    @organization = @conversation.organization
  end

  # POST /conversations
  # POST /conversations.json
  def create
    @conversation = Conversation.new(conversation_params)
    authorize @conversation

    respond_to do |format|
      if @conversation.save
        # TODO: Need to check if there is a better way of achieving the below case of adding conv creator as default member
        @conversation.conversation_members.create(:conversation_id=>@conversation.id, :member_id=>current_user.id)
        format.html { redirect_to @conversation, notice: 'Conversation was successfully created.' }
        format.json { render :show, status: :created, location: @conversation }
      else
        format.html { render :new }
        format.json { render json: @conversation.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /conversations/1
  # PATCH/PUT /conversations/1.json
  def update
    respond_to do |format|
      if @conversation.update(conversation_params)
        format.html { redirect_to @conversation, notice: 'Conversation was successfully updated.' }
        format.json { render :show, status: :ok, location: @conversation }
      else
        format.html { render :edit }
        format.json { render json: @conversation.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /conversations/1
  # DELETE /conversations/1.json
  def destroy
    @conversation.destroy
    respond_to do |format|
      format.html { redirect_to organization_url(@conversation.organization), notice: 'Conversation was successfully destroyed.' }
      format.json { head :no_content }
    end
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
