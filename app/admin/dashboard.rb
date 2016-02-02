ActiveAdmin.register_page "Dashboard" do

  menu priority: 1, label: proc{ I18n.t("active_admin.dashboard") }

  content title: proc{ I18n.t("active_admin.dashboard") } do
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
            column('Name') { |org| link_to(org.name, admin_organization_path(org)) }
            column('Created') { |org| time_ago_in_words(org.created_at) }
            column('Conversations #') { |org| org.conversations.size }
            column('Agenda Items #') { |org| org.agenda_items.size }
            column('Deliverables #') { |org| org.deliverables.size }
            # column('Comments #') { |user| user.comments.size }
          end
        end
      end
    end


    columns do
      column do
        div do
          br
          text_node %{<iframe src="https://rpm.newrelic.com/public/charts/c76YriGcesF" width="500" height="300" scrolling="no" frameborder="no"></iframe>}.html_safe
        end
      end
      column do
        div do
          br
          text_node %{<iframe src="https://rpm.newrelic.com/public/charts/bm91lgUjsA0" width="500" height="300" scrolling="no" frameborder="no"></iframe>}.html_safe
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
