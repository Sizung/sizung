class AddLastVisitedOrganizationToUsers < ActiveRecord::Migration
  def change
    add_reference :users, :last_visited_organization, type: :uuid, null: true
  end
end
