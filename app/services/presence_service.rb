class PresenceService
  PRESENCE_ONLINE = 'sizung.presence.online'

  def initialize
    @redis = RedisConnection.new.redis
  end

  def is_online(user_id)
    @redis.sismember(PRESENCE_ONLINE, user_id)
  end

  def came_online(user_id)
    @redis.sadd(PRESENCE_ONLINE, user_id)
  end

  def gone_offline(user_id)
    @redis.srem(PRESENCE_ONLINE, user_id)
  end
end