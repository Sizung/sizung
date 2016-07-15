module Api
  class UnseenObjectsController < Base
    before_filter :authenticate_user!
    # after_action :verify_authorized

    respond_to :json

    include Swagger::Blocks

    swagger_path '/{parent_type}/{parent_id}/unseen_objects' do
      operation :post, security: [bearer: []] do
        key :summary, 'Get the users unseen objects on a given level'
        key :tags, ['organization', 'conversation', 'agenda_item', 'deliverable', 'user', 'unseen_objects']

        parameter name: :parent_type, in: :path, required: true, type: :string
        parameter name: :parent_id, in: :path, required: true, type: :string
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
      @unseen_objects = parent.unseen_objects.where(user: current_user).includes(:user, :organization, :conversation, :agenda_item, :deliverable, :target)

      render json: @unseen_objects, include: params[:includes]
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
      deleted_unseen_objects = scope_to_delete(current_user.unseen_objects)
      render json: deleted_unseen_objects
    end

    private
      def parent_type
        @parent_type ||= params[:parent_type]
      end

      def parent
        @parent ||= parent_type.constantize.find(params["#{parent_type.underscore}_id"])
      end

      def scope_to_delete(scope)
        case params[:parent_type]
          when 'Conversation'
            scope.where(conversation: parent).where("(target_type = 'Attachment' AND agenda_item_id IS NULL AND deliverable_id IS NULL) OR target_type = 'Conversation' OR target_type = 'AgendaItem' OR (target_type = 'Comment' AND agenda_item_id IS NULL AND deliverable_id IS NULL) ").destroy_all
          when 'AgendaItem'
            scope.where(agenda_item: parent).where("(target_type = 'Attachment' AND deliverable_id IS NULL) OR target_type = 'AgendaItem' OR target_type = 'Deliverable' OR (target_type = 'Comment' AND deliverable_id IS NULL)").destroy_all
          when 'Deliverable'
            scope.where(deliverable: parent).destroy_all
          else
            []
        end
      end
  end
end
