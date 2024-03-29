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
      @device = Device.where(user: current_user, token: device_params[:token]).first_or_initialize(device_params)
      authorize @device

      if @device.save
        render json: @device, serializer: DeviceSerializer
      else
        render json: @device, status: 422, serializer: ActiveModel::Serializer::ErrorSerializer
      end
    end

    swagger_path '/devices/{id}' do
      operation :put, security: [bearer: []] do
        key :summary, 'Update the token for an existing Device.'
        key :tags, ['device']
        key :operationId, 'updateDeviceById'
        
        parameter name: :id, in: :path, required: true, type: :string
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

    def update
      @device = Device.where(user: current_user).find(params[:id])
      authorize @device

      if @device.update(device_params)
        render json: @device
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
