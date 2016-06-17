module Api
  class DevicesController < Base
    before_filter :authenticate_user!
    after_action :verify_authorized

    respond_to :json

    include Swagger::Blocks

    swagger_schema :DeviceInput do
      key :required, [:device]

      property :device, type: :object, required: [:token] do
        property :token, type: :string
      end
    end
    
    swagger_path '/devices' do
      operation :post, security: [bearer: []] do
        key :summary, 'Register a new Device.'
        key :tags, ['device']
        
        parameter name: :device, in: :body, required: true, description: 'Device fields' do
          schema do
            key :'$ref', :DeviceInput
          end
        end

        response 200 do
          key :description, 'Device response'
          schema do
            key :'$ref', :responseOne_Device
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
      @device = Device.new(device_params)
      @device.user = current_user
      authorize @device

      if @device.save
        render json: @device, serializer: DeviceSerializer
      else
        render json: @device, status: 422, serializer: ActiveModel::Serializer::ErrorSerializer
      end
    end

    private
      def device_params
        params.require(:device).permit(:token)
      end
  end
end
