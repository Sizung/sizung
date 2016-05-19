class OrganizationsController < ApplicationController
  before_filter :authenticate_user!
  before_action :set_organization, only: [:edit, :update, :destroy]
  after_action :verify_authorized,    except: :index
  after_action :verify_policy_scoped, only: :index
  layout 'conversation', only: [:show]

  respond_to :json, :html

  # GET /organizations
  # GET /organizations.json
  def index
    @organizations = policy_scope(Organization)

    next_path = if current_user.organizations.any?
                  organization_path(current_user.last_visited_organization || current_user.organizations.order(:created_at).last)
                else
                  new_organization_path
                end
    
    respond_to do |format|
      format.html { redirect_to next_path}
      format.json { render json: @organizations }
    end
  end

  # GET /organizations/1
  # GET /organizations/1.json
  def show
    respond_to do |format|
      format.html do
        @organization = policy_scope(Organization).find(params[:id])
        authorize @organization
        current_user.update last_visited_organization: @organization

        @organizations_json = ActiveModelSerializers::SerializableResource.new(policy_scope(Organization)).serializable_hash
        @users_json = ActiveModelSerializers::SerializableResource.new(@organization.members).serializable_hash
        render :show
      end

      format.json do
        @organization = policy_scope(Organization).includes(organization_members: :member).find(params[:id])
        authorize @organization
        current_user.update last_visited_organization: @organization

        @conversations = policy_scope(Conversation).where(organization: @organization).includes(:agenda_items, :deliverables, :conversation_members, :organization)
        @agenda_items = AgendaItem.where(conversation: @conversations).includes(:deliverables, :conversation, :owner)
        @deliverables = Deliverable.where(agenda_item: @agenda_items).where(assignee: current_user).includes(:agenda_item, :owner, :assignee)

        render json: @organization,
               include: %w(organization_members, organization_members.member),
               meta: {
                   conversations: to_json_api(@conversations),
                   agenda_items: to_json_api(@agenda_items),
                   deliverables: to_json_api(@deliverables),
                   editable: policy(@organization).edit?
               }
      end
    end

  end

  # GET /organizations/new
  def new
    @organization = current_user.organizations.build(owner: current_user)
    authorize @organization
  end

  # GET /organizations/1/edit
  def edit
  end

  # POST /organizations
  # POST /organizations.json
  def create
    @organization = current_user.organizations.create(organization_params.merge(owner: current_user))
    authorize @organization

    respond_to do |format|
      if @organization.save
        format.html { redirect_to @organization, notice: 'Organization was successfully created.' }
        format.json { render :show, status: :created, location: @organization }
      else
        format.html { render :new }
        format.json { render json: @organization.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /organizations/1
  # PATCH/PUT /organizations/1.json
  def update
    respond_to do |format|
      if @organization.update(organization_params)
        format.html { redirect_to @organization, notice: 'Organization was successfully updated.' }
        format.json { render :show, status: :ok, location: @organization }
      else
        format.html { render :edit }
        format.json { render json: @organization.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /organizations/1
  # DELETE /organizations/1.json
  def destroy
    @organization.destroy
    respond_to do |format|
      format.html { redirect_to organizations_url, notice: 'Organization was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_organization
      @organization = Organization.find(params[:id])
      authorize @organization
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def organization_params
      params.require(:organization).permit(:name, :mission, :owner_id)
    end
end
