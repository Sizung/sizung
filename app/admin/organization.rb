ActiveAdmin.register Organization do

index do
  selectable_column
  column :name
  column :owner
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
filter :name
# filter :mission
filter :owner
filter :created_at
# filter :updated_at

# Add or remove columns to toggle their visiblity in the index action
# index do
#   selectable_column
#   id_column
#   column :id
#   column :name
#   column :mission
#   column :owner
#   column :created_at
#   column :updated_at
#   actions
# end

# Add or remove rows to toggle their visiblity in the show action
# show do |organization|
#   row :id
#   row :name
#   row :mission
#   row :owner
#   row :created_at
#   row :updated_at
# end

# Add or remove fields to toggle their visibility in the form

end
