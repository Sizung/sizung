require 'launchy'

def tmp_email_filename(extension = '.txt')
  "#{Rails.root}/tmp/email-#{Time.now.to_i}#{extension}"
end

def save_and_open_email(mail)
  filename = tmp_email_filename

  File.open(filename, "w") do |f|
    f.write mail.to_s
  end

  open_in_browser(filename)
end

def open_in_browser(filename)
  Launchy.open(URI.parse("file://#{File.expand_path(filename)}"))
end

def links_in_email(email)
  URI.extract(email.default_part_body.to_s, ['http', 'https'])
end

# e.g. confirm in http://confirm
def parse_email_for_explicit_link(email, regex)
  regex = /#{Regexp.escape(regex)}/ unless regex.is_a?(Regexp)
  url = links_in_email(email).detect { |link| link =~ regex }
  request_uri(url)
end
