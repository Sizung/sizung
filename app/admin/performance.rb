ActiveAdmin.register_page 'Performance' do

  menu priority: 2, label: 'Performance'

  content title: proc{ I18n.t("active_admin.dashboard") } do
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
  end # content
end
