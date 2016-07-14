module Api
  class UsersController < Base
    skip_before_action :verify_authenticity_token, only: [:create]
    before_action :set_user, only: [:update]
    respond_to :json

    include Swagger::Blocks

    def index
      @user = User.find_by_email(params[:email])
      if @user
        render json: { emailExists: true }
      else
        render json: { emailExists: false }
      end
    end

    swagger_schema :UserInput do
      key :required, [:user]

      property :user, type: :object, required: [:email, :first_name, :last_name] do
        property :email, type: :string
        property :first_name, type: :string
        property :last_name, type: :string
        property :organization, type: :object do
          property :name, type: :string
        end
      end
    end

    
    swagger_path '/users' do
      operation :post, security: [bearer: []] do
        key :summary, 'Sign up a new user'
        key :tags, ['user']
        parameter name: :user, in: :body, required: true, description: 'User fields' do
          schema do
            key :'$ref', :UserInput
          end
        end
        
        response 200 do
          key :description, 'The new user'
          schema do
            key :'$ref', :responseOne_User
          end
        end
        response :default do
          key :description, 'Unexpected error'
        end
      end
    end

    def create
      @user = User.create!(user_params)
      organization_name = Organization::DEFAULT_NAME
      if params[:user][:organization][:name]
        organization_name = params[:user][:organization][:name]
      end
      if @user.persisted?
        @user.organizations.create!(name: organization_name, owner: @user)
      end
      render json: @user, serializer: UserSerializer
    end

    def update
      authorize @user
      @user.update!(update_user_params)
      render json: @user, serializer: UserSerializer
    end

    private
      def user_params
        params.require(:user).permit(:email, :first_name, :last_name, :password, :password_confirmation)
      end

      def update_user_params
        if !params[:user][:password].blank? && !params[:user][:password_confirmation].blank?
          params.require(:user).permit(:first_name, :last_name, :password, :password_confirmation)
        else
          params.require(:user).permit(:first_name, :last_name)
        end
      end

      def set_user
        @user = User.find(params[:id])
        # authorize @user
      end

  end
end
