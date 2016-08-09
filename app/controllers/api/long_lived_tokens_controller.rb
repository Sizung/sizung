module Api
  class LongLivedTokensController < Base
    before_filter :authenticate_user!
    #after_action :verify_authorized

    respond_to :json

    include Swagger::Blocks

    swagger_path '/long_lived_tokens' do
      operation :post, security: [bearer: []] do
        key :summary, 'Create a new long lived token.'
        key :description, 'The following flow is recommended for clients that want to keep their users logged in for a long time. <ol><li>Let the user login and get a new /session_tokens with it.</li><li>Get a long lived token using the jwt from the /session_tokens response.</li><li>Store the long-lived token on your client.</li></ol><p>You can then use the long-lived token to get new session-tokens before they expire or even after they already expired. You can also use the session token to get a new long-lived token before this one expires. Currently the long-lived token expires after 14 days but you should just read that information from the jwt itself.</p><p>A long-lived token is valid until it expires or the user revokes it. e.g. changes his password.</p>'
        key :tags, ['auth']

        response 201 do
          schema do
            key :required, [:token]
            property :token, type: :string, description: 'Your Long lived JSON Web Token'
          end
        end
        response 401 do
          key :description, 'No valid Bearer token. You need to get a valid session token first.'
          schema do
            key :required, [:error]
            property :error, type: :string, description: 'Error description', enum: ['Failed to Login']
          end
        end
        response :default do
          key :description, 'Unexpected error'
        end
      end
    end

    def create
      token = JsonWebToken.encode_long_lived({ 'user_id' => current_user.id }, current_user.long_lived_token_secret)

      respond_to do |format|
        format.json { render json: {'token' => token}, status: :created }
      end
    end
  end
end
