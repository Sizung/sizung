module Api
  class AgendaItemsController < Base
    before_filter :authenticate_user!
    after_action :verify_authorized
    before_action :set_agenda_item, only: [:update]

    respond_to :json

    include Swagger::Blocks

    swagger_path '/conversations/{conversation_id}/agenda_items' do
      operation :post, security: [bearer: []] do
        key :summary, 'List Agenda Items'
        key :tags, ['agenda_item', 'conversation']

        parameter name: :conversation_id, in: :path, required: true, type: :string
        response 200 do
          key :description, 'Agenda Item response'
          schema do
            key :'$ref', :responseOne_AgendaItem
          end
        end

        response :default do
          key :description, 'Unexpected error'
        end
      end
    end

    def index
      @conversation = Conversation.find(params[:conversation_id])
      authorize @conversation, :show?
      render json: @conversation.agenda_items.includes(:owner, :conversation, :deliverables)
    end

    swagger_path '/agenda_items/{id}' do
      operation :get, security: [bearer: []] do
        key :summary, 'Get an Agenda Item.'
        key :tags, ['agenda_item']

        parameter name: :id, in: :path, required: true, type: :string

        response 200 do
          key :description, 'Agenda Item response'
          schema do
            key :'$ref', :responseOne_AgendaItem
          end
        end

        response :default do
          key :description, 'Unexpected error'
        end
      end
    end

    def show
      @agenda_item = AgendaItem.unscoped.includes({ deliverables: [:owner, :assignee, :comments] }, :owner, :comments).find(params[:id])
      authorize @agenda_item, :show_including_archived?
      render json: @agenda_item, include: %w(deliverables)
    end

    swagger_schema :AgendaItemInput do
      key :required, [:agenda_item]

      property :agenda_item, type: :object, required: [:conversation_id, :title] do
        property :conversation_id, type: :string
        property :owner_id, type: :string
        property :due_on, type: :string, format: 'date'
        property :title, type: :string
        property :status, type: :string
      end
    end
    
    swagger_path '/agenda_items' do
      operation :post, security: [bearer: []] do
        key :summary, 'Create a new Agenda Item.'
        key :tags, ['agenda_item']
        
        parameter name: :agenda_item, in: :body, required: true, description: 'Agenda Item fields' do
          schema do
            key :'$ref', :AgendaItemInput
          end
        end

        response 200 do
          key :description, 'Agenda Item response'
          schema do
            key :'$ref', :responseOne_AgendaItem
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
      @agenda_item = AgendaItem.new(agenda_item_params)
      authorize @agenda_item
      @agenda_item.owner = current_user unless @agenda_item.owner

      if @agenda_item.save
        MentionedJob.perform_later(@agenda_item, current_user, agenda_item_url(id: @agenda_item.id))
        AgendaItemRelayJob.perform_later(agenda_item: @agenda_item, actor_id: current_user.id, action: 'create')
        UnseenService.new.handle_with(@agenda_item, current_user)
        render json: @agenda_item, serializer: AgendaItemSerializer
      else
        render json: @agenda_item, status: 422, serializer: ActiveModel::Serializer::ErrorSerializer
      end
    end


    swagger_path '/agenda_items/{id}' do
      operation :patch, security: [bearer: []] do
        key :summary, 'Update an Agenda Item.'
        key :tags, ['agenda_item']

        parameter name: :id, in: :path, required: true, type: :string
        parameter name: :agenda_item, in: :body, required: true, description: 'Agenda Item fields' do
          schema do
            key :'$ref', :AgendaItemInput
          end
        end

        response 200 do
          key :description, 'Agenda Item response'
          schema do
            key :'$ref', :responseOne_AgendaItem
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
      old_body = @agenda_item.title
      if @agenda_item.toggle_archive(params[:agenda_item][:archived]) || @agenda_item.update(agenda_item_params)
        MentionedJob.perform_later(@agenda_item, current_user, agenda_item_url(id: @agenda_item.id), old_body)
        AgendaItemRelayJob.perform_later(agenda_item: @agenda_item, actor_id: current_user.id, action: 'update')
        render json: @agenda_item
      else
        render json: @agenda_item, status: 422, serializer: ActiveModel::Serializer::ErrorSerializer
      end
    end

    private
      def agenda_item_params
        params.require(:agenda_item).permit(:conversation_id, :owner_id, :due_on, :title, :status)
      end

      def set_agenda_item
        @agenda_item = AgendaItem.find(params[:id])
        authorize @agenda_item
      end
  end
end
