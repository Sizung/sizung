class MentionsService
  ID_PATTERN = /@\[[^\]]*\]\(([^\)]*)\)/

  def extract_users(raw_body)
    raw_body.scan(ID_PATTERN).flatten.map { |id| User.find(id) }.compact
  end

  def send_mails(raw_body, url)
    extract_users(raw_body).each do |user|
      Notifications.mentioned(user, url).deliver_later
    end
  end
end