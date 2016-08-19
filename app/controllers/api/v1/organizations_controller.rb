module Api
  module V1
    class OrganizationsController < Base
      before_filter :authenticate_user!
      after_action :verify_authorized,    except: :index
      after_action :verify_policy_scoped, only: :index

      respond_to :json

      # GET /organizations.json
      def index
        @organizations = policy_scope(Organization).includes(:owner, :organization_members)
        @organizations = @organizations.includes(organization_members: :member) if params[:include] && params[:include].include?('organization_members.member')
        render json: @organizations, include: params[:include]
      end
      
      # GET /organizations/1.json
      def show
        # TODO: Remove that workaround when we switch to the final ActionCable release and can use connection-tokens
        # to build a list of connected connections per user and don't track the user as offline when he closes one of
        # his multiple browser windows. Then we can also remove that workaround.
        current_user.update presence_status: 'online'
        @organization = policy_scope(Organization).includes(:owner, :organization_members)
        @organization = @organization.includes(organization_members: :member) if params[:include] && params[:include].include?('organization_members.member')
        @organization = @organization.find(params[:id])
        authorize @organization
        current_user.update last_visited_organization: @organization

        render json: @organization,
               #include: %w(organization_members, organization_members.member),
               include: params[:include],
               meta: {
                 editable: policy(@organization).edit?
               }
      end
    end
  end
end
