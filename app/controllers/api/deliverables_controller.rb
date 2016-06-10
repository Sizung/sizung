module Api
  class DeliverablesController < ApplicationController
    before_filter :authenticate_user!
    after_action :verify_authorized
    before_action :set_deliverable, only: [:update]

    respond_to :json

    include Swagger::Blocks

    swagger_schema :DeliverableInput do
      key :required, [:deliverable]

      property :deliverable, type: :object, required: [:parent_type, :parent_id, :title] do
        property :parent_type, type: :string
        property :parent_id, type: :string
        property :title, type: :string
        property :status, type: :string
        property :assignee_id, type: :string
        property :due_on, type: :string, format: :date
      end
    end

    
    swagger_path '/deliverables' do
      operation :post, security: [bearer: []] do
        key :summary, 'Create a new Deliverable.'
        key :tags, ['deliverable']
        
        parameter name: :deliverable, in: :body, required: true, description: 'Deliverable fields' do
          schema do
            key :'$ref', :DeliverableInput
          end
        end

        response 200 do
          key :description, 'Deliverable response'
          schema do
            key :'$ref', :responseOne_Deliverable
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
      @deliverable = Deliverable.new(deliverable_params)
      authorize @deliverable
      @deliverable.owner = current_user
      @deliverable.assignee_id = current_user.id unless @deliverable.assignee_id

      if @deliverable.save
        MentionedJob.perform_later(@deliverable, current_user, deliverable_url(id: @deliverable.id))
        DeliverableRelayJob.perform_later(deliverable: @deliverable, actor_id: current_user.id, action: 'create')
        UnseenService.new.handle_with(@deliverable, current_user)
        if @deliverable.assignee != current_user
          Notifications.deliverable_assigned(@deliverable, current_user).deliver_later
        end
        render json: @deliverable, serializer: DeliverableSerializer
      else
        render json: @deliverable, status: 422, serializer: ActiveModel::Serializer::ErrorSerializer
      end

    end

    def show
      @deliverable = Deliverable.unscoped.includes(:parent, :owner, :assignee).find(params[:id])
      authorize @deliverable, :show_including_archived?
      render json: @deliverable, include: %w(parent conversation)
    end

    def update
      old_body = @deliverable.title
      original_parent_id = @deliverable.parent_id
      original_parent_type = @deliverable.parent_type
      old_assignee = @deliverable.assignee
      if @deliverable.toggle_archive(params[:deliverable][:archived]) || @deliverable.update(deliverable_params)
        MentionedJob.perform_later(@deliverable, current_user, deliverable_url(id: @deliverable.id), old_body)
        DeliverableRelayJob.perform_later(deliverable: @deliverable, actor_id: current_user.id, action: 'update')
        if @deliverable.assignee != old_assignee && @deliverable.assignee != current_user
          Notifications.deliverable_assigned(@deliverable, current_user).deliver_later
        end
        
        if(deliverable_params[:parent_id].present? && deliverable_params[:parent_id] != original_parent_id)
          # TODO: We probably want to do that for conversation as a parent also
          AgendaItemRelayJob.perform_later(agenda_item: AgendaItem.find(original_parent_id), actor_id: nil, action: 'update') if original_parent_type == 'AgendaItem'
          MovedDeliverableJob.perform_later(@deliverable, current_user)
        end
      end
      render json: @deliverable
    end

    private
      def deliverable_params
        params.require(:deliverable).permit(:parent_id, :parent_type, :title, :assignee_id, :status, :due_on)
      end

      def set_deliverable
        @deliverable = Deliverable.find(params[:id])
        authorize @deliverable
      end
  end
end
