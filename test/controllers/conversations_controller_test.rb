require 'test_helper'

class ConversationsControllerTest < ActionController::TestCase
  include Devise::TestHelpers

  def setup
    # @request.env['devise.mapping'] = Devise.mappings[:user]
    # sign_in @conversation.organization.owner
  end

  def test_index
    get :index
    assert_response :success
    assert_not_nil assigns(:conversations)
  end

  def test_new
    get :new
    assert_response :success
  end

  def test_create
    assert_difference('Conversation.count') do
      post :create, conversation: { organization_id: FactoryGirl.create(:organization).id, title: 'Our general discussion' }
    end

    assert_redirected_to conversation_path(assigns(:conversation))
  end

  def test_show
    conversation = FactoryGirl.create(:conversation)
    get :show, id: conversation
    assert_response :success
  end

  def test_edit
    conversation = FactoryGirl.create(:conversation)
    get :edit, id: conversation
    assert_response :success
  end

  def test_update
    conversation = FactoryGirl.create(:conversation)
    put :update, id: conversation, conversation: { organization_id: conversation.organization_id, title: conversation.title }
    assert_redirected_to conversation_path(assigns(:conversation))
  end

  def test_destroy
    conversation = FactoryGirl.create(:conversation)
    assert_difference('Conversation.count', -1) do
      delete :destroy, id: conversation
    end

    assert_redirected_to conversations_path
  end
end
