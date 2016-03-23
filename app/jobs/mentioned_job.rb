class MentionedJob < ActiveJob::Base
  include Rails.application.routes.url_helpers

  queue_as :default

  def perform(mentionable, actor, target_url, old_mentionable_body = nil)
    MentionsService.new.send_mails(mentionable, actor, target_url, old_mentionable_body)
  end
end
