require 'test_helper'

describe Api::CommentsController do
  include Devise::TestHelpers

  describe 'visitor' do
    it 'should not be allowed to create a new comment' do
      post :create, comment: {body: 'A comment from an unregistered visitor.'}
      assert_redirected_to new_user_session_path
    end
  end

  describe 'signed in' do
    setup do
      @comment = FactoryGirl.create(:comment)
      @other_comment = FactoryGirl.create(:comment)
      @request.env['devise.mapping'] = Devise.mappings[:user]
      sign_in @comment.commentable.organization.owner
    end

    it 'creates comment' do
      expect {
        post :create, comment: { body: @comment.body, commentable_id: @comment.commentable_id, commentable_type: @comment.commentable_type }
      }.must_change 'Comment.count'
      assert_response :success
    end

    it 'complains if the comment body is missing' do
      post :create, comment: { body: nil, commentable_id: @comment.commentable_id, commentable_type: @comment.commentable_type }
      assert_response 422
      res = JSON.parse(response.body)
      expect(res['errors'].size).must_equal 1
      expect(res['errors'].first['source']['pointer']).must_equal '/data/attributes/body'
      expect(res['errors'].first['detail']).must_equal "can't be blank"
    end
    
    it 'updates comment' do
      patch :update, id: @comment.id, comment: { body: 'changed body' }

      assert_response :success
      expect(@comment.reload.body).must_equal 'changed body'
    end

    it 'archive comment' do
      patch :update, id: @comment.id, comment: { archived: true }

      assert_response :success
      expect(@comment.reload).must_be :paranoia_destroyed?
    end

    it 'should freeze archived comments' do
      patch :update, id: @comment.id, comment: { archived: true }
      expect {
        patch :update, id: @comment.id, comment: { body: 'changed body' }
      }.must_raise ActiveRecord::RecordNotFound
    end

    it 'removes the unseen objects when a comment gets archived' do
      conversation = @comment.commentable
      conversation_member = FactoryGirl.create :conversation_member, conversation: conversation
      post :create, comment: { body: 'Thats what I say about it. :)', commentable_id: conversation.id, commentable_type: 'Conversation' }, format: :json

      expect(conversation_member.member.unseen_objects.count).must_equal 1

      comment = Comment.find(JSON.parse(response.body)['data']['id'])
      patch :update, id: comment.id, comment: { archived: true }

      expect(conversation_member.member.reload.unseen_objects.count).must_equal 0
    end

    it 'destroys comment' do
      expect {
        delete :destroy, id: @comment
      }.must_change 'Comment.count', -1

      assert_response :success
    end

    it 'removes the unseen objects when a comment gets removed' do
      conversation = @comment.commentable
      conversation_member = FactoryGirl.create :conversation_member, conversation: conversation
      post :create, comment: { body: 'Thats what I say about it. :)', commentable_id: conversation.id, commentable_type: 'Conversation' }, format: :json

      expect(conversation_member.member.unseen_objects.count).must_equal 1

      comment = Comment.find(JSON.parse(response.body)['data']['id'])
      delete :destroy, id: comment

      expect(conversation_member.member.reload.unseen_objects.count).must_equal 0
    end

    it 'updates the parent\'s update_at timestamp when a comment gets creates in that parent\'s timeline' do
      previousUpdatedAtTimestamp = @comment.commentable.updated_at
      previousCommentsCount = @comment.commentable.comments_count
      sleep 3
      expect {
        post :create, comment: { body: @comment.body, commentable_id: @comment.commentable_id, commentable_type: @comment.commentable_type }
      }.must_change 'Comment.count'
      assert_response :success
      expect(@comment.reload.commentable.comments_count).wont_equal previousCommentsCount
      expect(@comment.reload.commentable.updated_at).wont_equal previousUpdatedAtTimestamp
    end
  end
end
