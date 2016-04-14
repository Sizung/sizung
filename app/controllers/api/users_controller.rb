module Api
  class UsersController < ApplicationController
    skip_before_action :verify_authenticity_token, only: [:create]
    before_action :set_user, only: [:update]
    respond_to :json

    def index
      @user = User.find_by_email(params[:email])
      if @user
        render json: { emailExists: true }
      else
        render json: { emailExists: false }
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