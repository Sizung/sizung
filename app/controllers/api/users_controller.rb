module Api
  class UsersController < ApplicationController
    respond_to :json

    def index
      @user
      @user = User.find_by_email(params[:email])
      if @user
        render json: { emailExists: true }
      else
        render json: { emailExists: false }
      end
    end

    def create
      @user = User.new(user_params)
      @user.save

      render json: @user, serializer: UserSerializer
    end

    private
      def user_params
        params.require(:user).permit(:email, :first_name, :last_name, :password, :password_confirmation)
      end

  end
end