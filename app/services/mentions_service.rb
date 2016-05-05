class MentionsService
  ID_PATTERN = /@\[[^\]]*\]\(([^\)]*)\)/
  NAME_PATTERN = /@\[([^\]]*)\]\([^\)]*\)/

  def extract_users(raw_body, old_mentionable_body = nil)
    users = raw_body.scan(ID_PATTERN).flatten.map { |id| User.find(id) }.compact
    if old_mentionable_body
      users = users - old_mentionable_body.scan(ID_PATTERN).flatten.map { |id| User.find(id) }.compact
    end
    users
  end

  def display_body(mentionable)
    body = raw_body(mentionable)
    body.gsub(NAME_PATTERN, '\1')
  end

  def raw_body(mentionable)
    if mentionable.kind_of?(Comment)
      mentionable.body
    elsif mentionable.respond_to?(:title)
      mentionable.title
    else
      raise ArgumentError.new('Mentionable should be a comment or have a title')
    end
  end

  def send_mails(mentionable, actor, url, old_mentionable_body = nil)
    extract_users(raw_body(mentionable), old_mentionable_body).each do |user|
      Notifications.mentioned(user, mentionable, actor, url).deliver_later
    end
  end
end
