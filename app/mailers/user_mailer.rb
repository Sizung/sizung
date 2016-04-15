class UserMailer < Devise::Mailer
  include Devise::Controllers::UrlHelpers

  layout 'mailer'
end
