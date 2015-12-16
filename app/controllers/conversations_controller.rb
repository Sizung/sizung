class ConversationsController < ApplicationController
  before_filter :authenticate_user!
  before_action :set_conversation, only: [:show, :edit, :update, :destroy]
  before_action :set_organization, only: [:new, :create, :index]
  after_action :verify_authorized,    except: :index
  after_action :verify_policy_scoped, only: :index
  layout 'conversation', only: [:show]


  # GET /conversations
  # GET /conversations.json
  def index
    @conversations = @organization.conversations.order(:title)
    respond_to do |format|
      format.html { redirect_to @organization }
      format.json { render json: @conversations }
    end
  end

  # GET /conversations/1
  # GET /conversations/1.json
  def show
    @agenda_items_json = ActiveModel::SerializableResource.new(@conversation.agenda_items).serializable_hash
    @deliverables_json = ActiveModel::SerializableResource.new(@conversation.deliverables).serializable_hash
    @conversation_members_json = ActiveModel::SerializableResource.new(@conversation.conversation_members).serializable_hash
    # @conversation_objects_json = ActiveModel::SerializableResource.new(@conversation.conversation_objects).serializable_hash
    @users_json = @conversation.organization.members
    @current_organization_json = ActiveModel::SerializableResource.new(@conversation.organization).serializable_hash
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
        format.html { redirect_to @conversation, notice: 'Conversation was successfully created.' }
        format.json { render :show, status: :created, location: @conversation }
        # TODO: Need to check if there is a better way of achieving the below case of adding conv creator as default member
        @conversation.conversation_members.create(:conversation_id=>@conversation.id, :member_id=>current_user.id)
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
