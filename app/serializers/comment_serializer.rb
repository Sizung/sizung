class CommentSerializer < ActiveModel::Serializer
  attributes :id, :body
  belongs_to :attachment
  belongs_to :author
  belongs_to :conversation
end
