json.extract! @comment, :id, :conversation_id, :author_id, :body, :created_at, :updated_at
json.author do
  json.name @comment.author.name
end
