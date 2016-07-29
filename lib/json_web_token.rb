require 'jwt'

class JsonWebToken
  def self.encode(payload, expiration = 24.hours.from_now)
    payload = payload.dup
    payload['exp'] = expiration.to_i
    JWT.encode(payload, Rails.application.secrets.secret_key_base)
  end

  def self.decode(token, secret = Rails.application.secrets.secret_key_base)
    JWT.decode(token, secret).first
  end

  def self.encode_long_lived(payload, secret, expiration = 14.days.from_now)
    payload = payload.dup
    payload['exp']  = expiration.to_i
    payload['type'] = 'long-lived'
    JWT.encode(payload, secret)
  end

  def self.unverified_payload(token)
    JWT.decode(token, nil, false).first
  end

  def self.verified_with_secret?(token, secret)
    begin
      JWT.decode(token, secret, true).present?
    rescue JWT::VerificationError
      false
    end
  end
  
end
