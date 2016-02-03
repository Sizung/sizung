ActiveAdmin.register_page "Dashboard" do

  menu priority: 1, label: proc{ I18n.t("active_admin.dashboard") }

  content title: proc{ I18n.t("active_admin.dashboard") } do
    columns do
      column do
        panel 'Usage Overview' do
          table_for [1] do
            column('Users') { User.all.count }
            column('Organization') { Organization.all.count }
            column('Conversations') { Conversation.all.count }
            column('Agenda Items') { AgendaItem.all.count }
            column('Deliverables') { Deliverable.all.count }
            column('Comments') { Comment.all.count }
            column('Unseen Objects') { UnseenObject.all.count }
          end
        end
      end
    end

    columns do
      column do
        panel 'Recent Users' do
          table_for User.all.order(created_at: :desc).limit(10).map do
            column('Name') { |user| link_to(user.name, admin_user_path(user)) }
            column('Signed up') { |user| time_ago_in_words(user.created_at) }
            column('Organizations #') { |user| user.organizations.size }
            column('Conversations #') { |user| user.conversations.size }
            column('Agenda Items #') { |user| user.agenda_items.size }
            column('Deliverables #') { |user| user.deliverables.size }
            column('Comments #') { |user| user.comments.size }
          end
        end
      end
      column do
        panel 'Recent Organizations' do
          table_for Organization.all.order(created_at: :desc).limit(10).map do
            column('Name') { |organization| link_to(organization.name, admin_organization_path(organization)) }
            column('Owner') { |organization| link_to(organization.owner, admin_user_path(organization.owner)) }
            column('Users') { |organization| organization.organization_members.count }
            column('Conversations') { |organization| organization.conversations.count }
            column('Agenda Items') { |organization| organization.agenda_items.count }
            column('Deliverables') { |organization| organization.deliverables.count }
            column('Unseen Objects') { |organization| organization.unseen_objects.count }
            column('Created') { |org| time_ago_in_words(org.created_at) }
          end
        end
      end
    end

    # Here is an example of a simple dashboard with columns and panels.
    #
    # columns do
    #   column do
    #     panel "Recent Posts" do
    #       ul do
    #         Post.recent(5).map do |post|
    #           li link_to(post.title, admin_post_path(post))
    #         end
    #       end
    #     end
    #   end

    #   column do
    #     panel "Info" do
    #       para "Welcome to ActiveAdmin."
    #     end
    #   end
    # end
  end # content
end
