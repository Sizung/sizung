ActiveAdmin.register User do

  index do
    selectable_column
    column :email
    column :first_name
    column :last_name
    column :presence_status
    column :sign_in_count
    column :current_sign_in_at
    column :invitations_count
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
filter :email
# filter :encrypted_password
# filter :reset_password_token
# filter :reset_password_sent_at
# filter :remember_created_at
filter :sign_in_count
filter :current_sign_in_at
# filter :last_sign_in_at
# filter :current_sign_in_ip
# filter :last_sign_in_ip
# filter :confirmation_token
# filter :confirmed_at
# filter :confirmation_sent_at
# filter :unconfirmed_email
filter :failed_attempts
# filter :unlock_token
# filter :locked_at
filter :created_at
# filter :updated_at
filter :first_name
filter :last_name
# filter :invitation_token
# filter :invitation_created_at
# filter :invitation_sent_at
# filter :invitation_accepted_at
# filter :invitation_limit
# filter :invited_by_type
# filter :invited_by
filter :invitations_count
filter :presence_status

# Add or remove columns to toggle their visiblity in the index action
# index do
#   selectable_column
#   id_column
#   column :id
#   column :email
#   column :encrypted_password
#   column :reset_password_token
#   column :reset_password_sent_at
#   column :remember_created_at
#   column :sign_in_count
#   column :current_sign_in_at
#   column :last_sign_in_at
#   column :current_sign_in_ip
#   column :last_sign_in_ip
#   column :confirmation_token
#   column :confirmed_at
#   column :confirmation_sent_at
#   column :unconfirmed_email
#   column :failed_attempts
#   column :unlock_token
#   column :locked_at
#   column :created_at
#   column :updated_at
#   column :first_name
#   column :last_name
#   column :invitation_token
#   column :invitation_created_at
#   column :invitation_sent_at
#   column :invitation_accepted_at
#   column :invitation_limit
#   column :invited_by_type
#   column :invited_by
#   column :invitations_count
#   column :presence_status
#   actions
# end

# Add or remove rows to toggle their visiblity in the show action
# show do |user|
#   row :id
#   row :email
#   row :encrypted_password
#   row :reset_password_token
#   row :reset_password_sent_at
#   row :remember_created_at
#   row :sign_in_count
#   row :current_sign_in_at
#   row :last_sign_in_at
#   row :current_sign_in_ip
#   row :last_sign_in_ip
#   row :confirmation_token
#   row :confirmed_at
#   row :confirmation_sent_at
#   row :unconfirmed_email
#   row :failed_attempts
#   row :unlock_token
#   row :locked_at
#   row :created_at
#   row :updated_at
#   row :first_name
#   row :last_name
#   row :invitation_token
#   row :invitation_created_at
#   row :invitation_sent_at
#   row :invitation_accepted_at
#   row :invitation_limit
#   row :invited_by_type
#   row :invited_by
#   row :invitations_count
#   row :presence_status
# end

# Add or remove fields to toggle their visibility in the form

end
