json.array!(@conversations) do |conversation|
  json.extract! conversation, :id, :title, :organization_id
  json.url conversation_url(conversation, format: :json)
end
