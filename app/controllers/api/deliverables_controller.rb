module Api
  class DeliverablesController < Base
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
        # TODO @ani: find a better way of passing the source timeline while creating a deliverable
        if params[:source_timeline]
          source_timeline = params[:source_timeline]
          child_comment_body = current_user.first_name + ' ' + current_user.last_name + ' created this deliverable from ' + source_timeline[:title] + ': ' + source_timeline_url(source_timeline)
          parent_comment_body = current_user.first_name + ' ' + current_user.last_name + ' created this deliverable in ' + ( @deliverable.agenda_item ? @deliverable.agenda_item.conversation.title : @deliverable.conversation.title ) + ': ' + deliverable_url(@deliverable)
          @child_comment = Comment.new({ commentable_id: @deliverable.id, commentable_type: 'Deliverable', author_id: current_user.id, body: child_comment_body})
          @child_comment.save!
          if @deliverable.conversation.id != source_timeline[:id]
            @parent_comment = Comment.new({ commentable_id: source_timeline[:id], commentable_type: source_timeline[:type], author_id: current_user.id, body: parent_comment_body})
            @parent_comment.save!
          end
        end
        DeliverableCreatedJob.perform_later(@deliverable, current_user)
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
      old_assignee = @deliverable.assignee
      old_status   = @deliverable.status
      old_archived = @deliverable.archived?

      
      if @deliverable.toggle_archive(params[:deliverable][:archived]) || @deliverable.update(deliverable_params)
        DeliverableRelayJob.perform_later(deliverable: @deliverable, actor_id: current_user.id, action: 'update')
        if @deliverable.assignee != old_assignee
          DeliverableReassignedJob.perform_later(@deliverable, old_assignee, current_user)
        end

        if @deliverable.status != old_status && @deliverable.resolved?
          DeliverableResolvedJob.perform_later(@deliverable, current_user)
        end

        if @deliverable.archived? != old_archived && @deliverable.archived?
          DeliverableArchivedJob.perform_later(@deliverable, current_user)
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

      def source_timeline_url(source_timeline)

        src_url = case source_timeline[:type]
                    when 'Conversation'
                      conversation_url(Conversation.find(source_timeline[:id]))
                    when 'AgendaItem'
                      agenda_item_url(AgendaItem.find(source_timeline[:id]))
                    when 'Deliverable'
                      deliverable_url(Deliverable.find(source_timeline[:id]))
                    else
                      []
                  end
        return src_url
      end
  end
end
