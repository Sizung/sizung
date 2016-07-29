require 'json_web_token'

module Api
  class SessionTokensController < Devise::SessionsController
    before_action :authenticate_user!, except: [:create]
    skip_before_action :verify_authenticity_token

    include Swagger::Blocks

    swagger_schema :AuthInput do
      key :required, [:user]

      property :user, type: :object, required: [:email, :password] do
        property :email, type: :string
        property :password, type: :string
      end
    end
    
    swagger_path '/session_tokens' do
      operation :post do
        key :summary, 'Returns a JSON Web Token for request authorization'
        key :description, 'The JWT that you get here should be used as the **Bearer Authorization header** for the other api endpoints'
        key :operationId, 'createJWT'
        key :tags, ['auth']
        key :produces, ['application/json']
        parameter name: :user, in: :body, description: 'Username and password' do
          schema do
            key :'$ref', :AuthInput
          end
        end

        parameter name: :long_lived_token, in: :body, type: :string, description: 'The long lived JSON Web Token'
        
        response 201 do
          key :description, 'Your JSON Web Token for request authorization'
          schema do
            key :required, [:token]
            property :token, type: :string, description: 'Your JSON Web Token for request authorization'
          end
        end
        response 401 do
          key :description, 'Invalid email or password or no long lived JSON Web Token'
          schema do
            key :required, [:error]
            property :error, type: :string, description: 'Error description', enum: ['Invalid email or password.', 'The long lived token is missing, wrong, expired or got revoked. You have to login again and create a new one.']
          end
        end
        response :default do
          key :description, 'Unexpected error'
        end
      end
    end
    
    def create
      if params[:user]
        user = warden.authenticate!({scope: :user})
        sign_in(:user, user)
      elsif params[:long_lived_token]
        long_lived_token = params[:long_lived_token]
        user = User.find_by(id: JsonWebToken.unverified_payload(long_lived_token)['user_id'])
        unless JsonWebToken.verified_with_secret?(long_lived_token, user.try(:long_lived_token_secret))
          return render json: { error: 'The long lived token is missing, wrong, expired or got revoked. You have to login again and create a new one.' }, status: 401
        end
      end

      token = JsonWebToken.encode('user_id' => user.id)

      respond_to do |format|
        format.json { render json: {'token' => token}, status: :created }
      end
    end

    def show
      respond_to do |format|
        format.json { render json: {'logged_in' => true} }
      end
    end
  end
end
