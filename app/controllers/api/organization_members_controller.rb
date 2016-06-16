module Api
  class OrganizationMembersController < Base
    before_action :set_organization, only: [:create]
    before_action :authenticate_user!
    after_action :verify_authorized

    respond_to :json

    include Swagger::Blocks

    swagger_schema :OrganizationMemberInputForCreate do
      key :required, [:organization_id, :email]

      property :organization_id, type: :string
      property :email, type: :string
      property :admin, type: :boolean, description: 'true if the user should have admin privileges on the organization, false otherwise. Default: false'
    end
    
    swagger_path '/organization_members' do
      operation :post, security: [bearer: []] do
        key :summary, 'Create a new Organization Member.'
        key :tags, ['organization_member']
        
        parameter name: :organization_member, in: :body, required: true, description: 'Organization member fields' do
          schema do
            key :'$ref', :OrganizationMemberInputForCreate
          end
        end

        response 200 do
          key :description, 'Organization Member response'
          schema do
            key :'$ref', :responseOne_OrganizationMember
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
      @user = InvitationService.new.invite(params[:email], @organization, current_user, params[:admin])
      authorize @organization, :show?
      @organization_member = @user.organization_members.find_by(organization: @organization)

      OrganizationMemberRelayJob.perform_later(organization_member: @organization_member, actor_id: current_user.id, action: 'create')
      
      render json: @organization_member, include: [:member]
    end

    swagger_schema :OrganizationMemberInput do
      property :admin, type: :boolean, description: 'true if the user should have admin privileges on the organization, false otherwise.'
    end

    
    swagger_path '/organization_members/{id}' do
      operation :patch, security: [bearer: []] do
        key :summary, 'Update an existing Organization Member.'
        key :tags, ['organization_member']

        parameter name: :id, type: :string, in: :path, required: true, description: 'The id of the Organization Member object to update'
        
        parameter name: :organization_member, in: :body, required: true, description: 'Organization member fields' do
          schema do
            key :'$ref', :OrganizationMemberInput
          end
        end

        response 200 do
          key :description, 'Organization Member response'
          schema do
            key :'$ref', :responseOne_OrganizationMember
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
      @organization_member = OrganizationMember.find(params[:id])
      authorize @organization_member, :update?
      if @organization_member.update(organization_member_params)
        render json: @organization_member, include: [:member]
      else
        render json: @organization_member, status: 422, serializer: ActiveModel::Serializer::ErrorSerializer
      end
    end
    
    def destroy
      @organization_member = OrganizationMember.find(params[:id])
      authorize @organization_member
      @organization_member.transaction do
        @organization_member.destroy!
        ConversationMember.
          joins(conversation: :organization).
          references(converation: :organization).
          where(conversations: { organization_id: @organization_member.organization }, member: @organization_member.member).
          each(&:destroy!)
        
        if(@organization_member.member.last_visited_organization_id == @organization_member.organization_id)
          @organization_member.member.update! last_visited_organization: @organization_member.member.organizations.where.not(id: @organization_member.organization_id).order(:updated_at).last
        end
      end
            
      render json: @organization_member, serializer: OrganizationMemberSerializer
    end

    private
      def organization_member_params
        params.require(:organization_member).permit(:organization_id, :member_id, :admin)
      end

      def set_organization
        @organization = policy_scope(Organization).find(params[:organization_id])
      end

    # def invite_resource
    #   InvitationService.new.invite(params[:email], @organization, current_user) do
    #     set_flash_message :notice, :send_instructions, email: params[:email]
    #   end
    # end
    #
    # def set_organization
    #   @organization = policy_scope(Organization).find(params[:organization_id])
    # end

    # POST /organization_members.json
    # def create
    #   self.resource = invite_resource
    #   resource_invited = resource.errors.empty?
    #
    #   yield resource if block_given?
    #
    #   if resource_invited
    #     if is_flashing_format? && self.resource.invitation_sent_at
    #       set_flash_message :notice, :send_instructions, :email => self.resource.email
    #     end
    #     @invited_user = User.find_by(email: params[:email])
    #     @organization_member = OrganizationMember.find_by(member_id: @invited_user.id, organization_id: params[:organization_id])
    #     if @organization_member
    #       render json: @organization_member, serializer: OrganizationMemberSerializer
    #     else
    #       render json: { errorMessage: "User invitation was not persisted" }
    #     end
    #   else
    #     render json: { errorMessage: "User could not be invited" }
    #   end
    # end


  end
end
