require 'test_helper'

describe AgendaItemsController do
  include Devise::TestHelpers

  describe 'visitor' do
    it 'should not be allowed to create a new agenda item' do
      post :create, agenda_item: {title: 'Last weeks review'}
      assert_redirected_to new_user_session_path
    end
  end

  describe 'signed in' do
    setup do
      @conversation = FactoryGirl.create(:conversation)
      @request.env['devise.mapping'] = Devise.mappings[:user]
      @current_user = @conversation.organization.owner
      sign_in @current_user
      @agenda_item  = FactoryGirl.create(:agenda_item, owner: @current_user)
    end

    it 'creates agenda item' do
      expect {
        post :create, agenda_item: { title: 'Last months review', conversation_id: @conversation.id }, format: :json
      }.must_change 'AgendaItem.count'

      assert_response :success
      agenda_item = JSON.parse(response.body)
      assert_equal 'Last months review', agenda_item['data']['attributes']['title']
      assert_equal @current_user.id, agenda_item['data']['relationships']['owner']['data']['id']
    end
  end
end
