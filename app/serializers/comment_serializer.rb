class CommentSerializer < ActiveModel::Serializer
  attributes :id, :body, :created_at, :updated_at
  belongs_to :author
  belongs_to :commentable
end
