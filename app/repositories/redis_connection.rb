class RedisConnection
  def initialize
    # We are using the same redis configuration that is used for actioncable.
    # Just to keep it in one single place.
    @redis_path = Rails.root.join('config/redis/cable.yml')
  end

  def redis
    Redis.new(config)
  end

  private
    attr_accessor :redis_path

    def config
      @config ||= config_for(redis_path).with_indifferent_access
    end

    # FIXME: Extract this from Rails::Application in a way it can be used here.
    def config_for(path)
      if path.exist?
        require 'yaml'
        require 'erb'
        (YAML.load(ERB.new(path.read).result) || {})[Rails.env] || {}
      else
        raise "Could not load configuration. No such file - #{path}"
      end
    rescue Psych::SyntaxError => e
      raise "YAML syntax error occurred while parsing #{path}. " \
        'Please note that YAML must be consistently indented using spaces. Tabs are not allowed. ' \
        "Error: #{e.message}"
    end
end
