module Api
  class OrganizationsController < Base
    before_filter :authenticate_user!
    before_action :set_organization, only: [:update]
    after_action :verify_authorized,    except: :index
    after_action :verify_policy_scoped, only: :index

    respond_to :json

    include Swagger::Blocks

    swagger_path '/organizations' do
      operation :get, security: [bearer: []] do
        key :summary, 'List organizations'
        key :description, 'Returns the list of organizations the user is a member of'
        key :operationId, 'listOrganizations'
        key :tags, ['organization']
        key :produces, ['application/json']
        
        response 200 do
          key :description, 'An array of organizations'
          schema do
            key :'$ref', :responseMany_Organization
          end
        end
        response :default do
          key :description, 'Unexpected error'
        end
      end
    end
    
    # GET /organizations.json
    def index
      @organizations = policy_scope(Organization)
      render json: @organizations
    end
    
    swagger_path '/organizations/{id}' do
      operation :get, security: [bearer: []] do
        key :summary, 'Details for a specific Organization'
        key :description, 'Returns the all details for the organization overview'
        key :operationId, 'findOrganizationById'
        key :tags, ['organization']
        key :produces, ['application/json']

        parameter name: :id, in: :path, type: :string, required: true
        
        response 200 do
          key :description, 'Organization response'
          schema do
            key :'$ref', :responseOne_Organization
          end
        end
        response :default do
          key :description, 'Unexpected error'
        end
      end
    end
    
    # GET /organizations/1.json
    def show
      # TODO: Remove that workaround when we switch to the final ActionCable release and can use connection-tokens
      # to build a list of connected connections per user and don't track the user as offline when he closes one of
      # his multiple browser windows. Then we can also remove that workaround.
      current_user.update presence_status: 'online'
      @organization = policy_scope(Organization).includes(organization_members: :member).find(params[:id])
      authorize @organization
      current_user.update last_visited_organization: @organization

      @conversations = policy_scope(Conversation).where(organization: @organization).includes(:agenda_items, :deliverables, :conversation_members, :organization)
      @agenda_items = AgendaItem.where(conversation: @conversations).includes(:deliverables, :conversation, :owner)
      @deliverables = Deliverable.where(parent_id: @agenda_items).includes(:parent, :owner, :assignee)
      @conversation_deliverables = Deliverable.where(parent_id: @conversations).includes(:parent, :owner, :assignee)

      render json: @organization,
             include: %w(organization_members, organization_members.member),
             meta: {
                 conversations: to_json_api(@conversations),
                 agenda_items: to_json_api(@agenda_items),
                 deliverables: to_json_api(@deliverables),
                 conversation_deliverables: to_json_api(@conversation_deliverables),
                 editable: policy(@organization).edit?
             }
    end

    swagger_schema :OrganizationInput do
      key :required, [:organization]

      property :organization, type: :object do
        property :name, type: :string
      end
    end

    swagger_path '/organizations' do
      operation :post, security: [bearer: []] do
        key :operationId, 'createOrganization'
        key :summary, 'Create Organization'
        key :tags, ['organization']
        key :produces, ['application/json']

        parameter name: :organization, in: :body, required: true, description: 'Organization fields' do
          schema do
            key :'$ref', :OrganizationInput
          end
        end

        response 200 do
          key :description, 'Organization response'
          schema do
            key :'$ref', :responseOne_Organization
          end
        end

        response 422, description: 'Unprocessable Resource' do
          schema do
            key :'$ref', :errors
          end
        end

        response :default do
          key :description, 'Unexpected error'
        end
      end
    end
    
    def create
      @organization = Organization.new(organization_params)
      @organization.owner = current_user
      authorize @organization
      if @organization.save
        render json: @organization, serializer: OrganizationSerializer
      else
        render json: @organization, status: 422, serializer: ActiveModel::Serializer::ErrorSerializer
      end
    end
    
    swagger_path '/organizations/{id}' do
      operation :patch, security: [bearer: []] do
        key :summary, 'Update a specific Organization'
        key :description, 'Returns the all details for the organization overview'
        key :operationId, 'updateOrganizationById'
        key :tags, ['organization']
        key :produces, ['application/json']

        parameter name: :id, in: :path, type: :string, required: true
        
        parameter name: :organization, in: :body, required: true, description: 'Organization fields to update' do
          schema do
            key :'$ref', :OrganizationInput
          end
        end

        response 200 do
          key :description, 'Organization response'
          schema do
            key :'$ref', :responseOne_Organization
          end
        end

        response 422, description: 'Unprocessable Resource' do
          schema do
            key :'$ref', :errors
          end
        end

        response :default do
          key :description, 'Unexpected error'
        end
      end
    end
    
    def update
      authorize @organization

      if @organization.update(organization_update_params)
        render json: @organization, serializer: OrganizationSerializer
      else
        render json: @organization, status: 422, serializer: ActiveModel::Serializer::ErrorSerializer
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

      def organization_update_params
        params.require(:organization).permit(:name, :mission)
      end
  end
end
