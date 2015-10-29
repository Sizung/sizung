# This is the place where you authorize the incoming connection, and proceed to establish it if all is well.
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    protected
      def find_verified_user
        # logger.info '======================='
        # logger.info "==== #{cookies.signed.inspect}"
        # logger.info "==== #{cookies.signed['warden.user.user.key'].inspect}"
        # logger.info "==== #{cookies.signed['user.id']}"
        # logger.info "==== #{cookies.signed['user.expires_at']}"
        # logger.info '======================='
        verified_user = User.find_by(id: cookies.signed['user.id'])
        if verified_user && cookies.signed['user.expires_at'] > Time.now
          logger.info "Verified user: #{verified_user}"
          verified_user
        else
          logger.error "User not found or token has expired. User: #{verified_user}, UserId: #{cookies.signed['user.id']}, Expired: #{cookies.signed['user.expires_at']}."
          reject_unauthorized_connection
        end
      end
  end
end
