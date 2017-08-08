class Users::SessionsController < Devise::SessionsController
  # layout 'conversation', only: [:new]
  
  # before_filter :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  # def create
  #   super
  # end

  # DELETE /resource/sign_out
  def destroy
    @latest_user_time_track = TimeTrack.where(user_id: current_user.id).order(created_at: :desc).first
    if @latest_user_time_track && !@latest_user_time_track.out_time
      @latest_user_time_track.out_time = Time.now
      @latest_user_time_track.save
    end
    super
  end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.for(:sign_in) << :attribute
  # end
end
