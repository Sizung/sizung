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
      sign_in @comment.conversation.organization.owner
    end

    it 'gets index' do
      get :index
      value(response).must_be :success?
      comments = assigns(:comments)
      value(comments).wont_be :nil?
      value(comments.size).must_equal 1
    end

    it 'gets new' do
      get :new
      value(response).must_be :success?
    end

    it 'creates comment' do
      expect {
        post :create, comment: { body: @comment.body, conversation_id: @comment.conversation_id }
      }.must_change 'Comment.count'

      must_redirect_to comment_path(assigns(:comment))
    end

    it 'shows comment' do
      get :show, id: @comment
      value(response).must_be :success?
    end

    it 'gets edit' do
      get :edit, id: @comment
      value(response).must_be :success?
    end

    it 'updates comment' do
      put :update, id: @comment, comment: { author_id: @comment.author_id, body: @comment.body, conversation_id: @comment.conversation_id }
      must_redirect_to comment_path(assigns(:comment))
    end

    it 'destroys comment' do
      expect {
        delete :destroy, id: @comment
      }.must_change 'Comment.count', -1

      must_redirect_to comments_path
    end
  end
end
