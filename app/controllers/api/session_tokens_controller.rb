require 'json_web_token'

module Api
  class SessionTokensController < Devise::SessionsController
    before_action :authenticate_user!, except: [:create]
    skip_before_action :verify_authenticity_token

    include Swagger::Blocks

    swagger_schema :AuthInput do
      key :required, [:user]

      property :user do
        key :type, :object

        property :email do
          key :type, :string
        end
        property :password do
          key :type, :string
        end
      end
    end
    
    swagger_path '/session_tokens' do
      operation :post do
        key :description, 'Returns a Json Web Token for request authorization'
        key :operationId, 'createJWT'
        key :tags, ['auth']
        key :produces, ['application/json']
        parameter name: :user, in: :body, required: true, description: 'Username and password' do
          schema do
            key :'$ref', :AuthInput
          end
        end
        
        response 201 do
          key :description, 'jwt response'
        end
        response :default do
          key :description, 'Invalid email or password'
        end
      end
    end
    
    def create
      user = warden.authenticate!({scope: :user})
      sign_in(:user, user)
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
