class MentionedJob < ActiveJob::Base
  include Rails.application.routes.url_helpers

  queue_as :default

  def perform(raw_body, target_url)
    MentionsService.new.send_mails(raw_body, target_url)
  end
end
