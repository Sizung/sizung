class MentionedJob < ActiveJob::Base
  include Rails.application.routes.url_helpers

  queue_as :default

  def perform(mentionable, actor, target_url)
    MentionsService.new.send_mails(mentionable, actor, target_url)
  end
end
