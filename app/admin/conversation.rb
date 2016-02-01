ActiveAdmin.register Conversation do

index do
  selectable_column
  column :title
  column :organization
  column :comments_count
  column :created_at
  actions
end


# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
# permit_params :list, :of, :attributes, :on, :model
#
# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if resource.something?
#   permitted
# end


# Limit actions available to your users by adding them to the 'except' array
# actions :all, except: []
actions :all, except: [:new, :edit, :update, :destroy]

# Add or remove filters (you can use any ActiveRecord scope) to toggle their
# visibility in the sidebar
filter :id
filter :title
filter :organization
filter :created_at
# filter :updated_at
# filter :comments_count

# Add or remove columns to toggle their visiblity in the index action
# index do
#   selectable_column
#   id_column
#   column :id
#   column :title
#   column :organization
#   column :created_at
#   column :updated_at
#   column :comments_count
#   actions
# end

# Add or remove rows to toggle their visiblity in the show action
# show do |conversation|
#   row :id
#   row :title
#   row :organization
#   row :created_at
#   row :updated_at
#   row :comments_count
# end

# Add or remove fields to toggle their visibility in the form

end
