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
    respond_to do |format|
      format.html { redirect_to current_user.organizations.first }
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

        @organizations_json = ActiveModel::SerializableResource.new(policy_scope(Organization)).serializable_hash
        @users_json = ActiveModel::SerializableResource.new(@organization.members).serializable_hash
        render :show
      end

      format.json do
        @organization = policy_scope(Organization).includes(
            :conversations,
            :organization_members,
            { agenda_items: [:comments, :deliverables] },
            { deliverables: [:comments] }
        ).find(params[:id])
        authorize @organization

        render json: @organization, include: %w(conversations agenda_items deliverables organization_members)
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
