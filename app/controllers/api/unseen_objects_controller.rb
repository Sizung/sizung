module Api
  class UnseenObjectsController < Base
    before_filter :authenticate_user!
    # after_action :verify_authorized

    FILTERS = %w(subscribed unsubscribed)
    
    respond_to :json

    include Swagger::Blocks

    swagger_path '/{parent_type}/{parent_id}/unseen_objects' do
      operation :get, security: [bearer: []] do
        key :summary, 'Get the users unseen objects on a given level'
        key :tags, ['organization', 'conversation', 'agenda_item', 'deliverable', 'user', 'unseen_objects']

        parameter name: :parent_type, in: :path, required: true, type: :string, enum: ['users', 'organizations', 'conversations', 'agenda_items', 'deliverables']
        parameter name: :parent_id, in: :path, required: true, type: :string
        parameter name: :filter, in: :query, type: :string, enum: ['subscribed', 'unsubscribed'], description: 'Filter the unseen objects by relevance. e.g. add filter=subscribed to only get the relevant unseen objects for the relevance stream.'
        parameter name: :include, in: :query, type: :string, description: 'See http://jsonapi.org/format/#fetching-includes for how the include parameter works. e.g. for the relevance stream it makes sense to use include=timeline'
        parameter name: 'page[number]', in: :query, type: :integer, description: 'Using pagination: The number of the page you want to receive.'
        parameter name: 'page[size]',   in: :query, type: :integer, description: 'Using pagination: The size of the page you want to receive.'
        
        response 200 do
          key :description, 'Unseen Object response'
          schema do
            key :'$ref', :responseOne_UnseenObject
          end
        end

        response :default do
          key :description, 'Unexpected error'
        end
      end
    end

    def index
      authorize parent, :show?
      @unseen_objects = parent.unseen_objects.where(user: current_user).includes(:organization, :conversation, :agenda_item, :deliverable, :target, :timeline)

      if params[:filter] && FILTERS.include?(params[:filter])
        @unseen_objects = @unseen_objects.send params[:filter]
      end

      if params[:page]
        if params[:page][:number]
          @unseen_objects = @unseen_objects.page(params[:page][:number])
        end
        if params[:page][:size]
          @unseen_objects = @unseen_objects.per(params[:page][:size])
        end        
      end

      render json: @unseen_objects, include: params[:include]
    end

    swagger_path '/{parent_type}/{parent_id}/unseen_objects' do
      operation :delete, security: [bearer: []] do
        key :summary, 'Delete the users unseen objects on the given timeline'
        key :tags, ['conversation', 'agenda_item', 'deliverable', 'unseen_objects']

        parameter name: :parent_type, in: :path, required: true, type: :string
        parameter name: :parent_id, in: :path, required: true, type: :string
        response 200 do
          key :description, 'Unseen Objects that got deleted'
          schema do
            key :'$ref', :responseMany_UnseenObject
          end
        end

        response :default do
          key :description, 'Unexpected error'
        end
      end
    end
    
    def destroy_all
      # authorize parent, :show?
      deleted_unseen_objects = UnseenService.new.remove_for_timeline(current_user, parent)
      render json: deleted_unseen_objects
    end

    private
      def parent_type
        @parent_type ||= params[:parent_type]
      end

      def parent
        @parent ||= parent_type.constantize.find(params["#{parent_type.underscore}_id"])
      end
  end
end
