module Api
  class Base < ApplicationController
    include Pundit

    rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

    private

    def user_not_authorized
      render json: { error: 'You are not authorized to perform this request'}, status: :unauthorized
    end
  end  
end
