module Api
  class TimeTracksController < Base
    # before_filter :authenticate_user!
    # before_action :set_time_track, only: [:update]
    # after_action :verify_authorized

    def create
      @latest_time_track = TimeTrack.where(user_id: current_user.id).order(created_at: :desc).first
      @time_track = TimeTrack.new(time_track_params)
      @time_track.in_time = Time.now
      @time_track.user = current_user
      if @latest_time_track
        @latest_time_track.out_time = Time.now
        @latest_time_track.save
      end

      if @time_track.save
        render json: @time_track
      else
        render json: @time_track, status: 422, serializer: ActiveModel::Serializer::ErrorSerializer
      end

    end

    def update
      @time_track = TimeTrack.where(user_id: current_user.id, chat_id: params[:time_track][:chat_id]).order(created_at: :desc).first
      if @time_track
        @time_track.out_time = Time.now
        @time_track.touch
        render json:@time_track
      else
        render json: @time_track, status: 422, serializer: ActiveModel::Serializer::ErrorSerializer
      end
    end

    private
      def set_time_track
        @time_track = TimeTrack.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def time_track_params
        params.require(:time_track).permit(:chat_id, :chat_type)
      end
  end
end