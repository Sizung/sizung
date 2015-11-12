require 'test_helper'

describe CommentsController do
  include Devise::TestHelpers

  describe 'visitor' do
    it 'should not see any comments' do
      get :index
      assert_response :redirect
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

    it 'destroys comment' do
      expect {
        delete :destroy, id: @comment
      }.must_change 'Comment.count', -1

      assert_response :success
    end
  end
end
