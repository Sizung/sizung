module Api
  class OrganizationsController < ApplicationController
    before_filter :authenticate_user!
    after_action :verify_authorized,    except: :index
    after_action :verify_policy_scoped, only: :index

    respond_to :json

    # GET /organizations.json
    def index
      @organizations = policy_scope(Organization)
      render json: @organizations
    end

    # GET /organizations/1.json
    def show
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
end
