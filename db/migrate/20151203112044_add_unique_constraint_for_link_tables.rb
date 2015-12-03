class AddUniqueConstraintForLinkTables < ActiveRecord::Migration
  def change
    rs = connection.exec_query('select organization_id, member_id, count(*) as c from organization_members group by organization_id, member_id')
    rs.each do |row|
      if row['c'].to_i > 1
        (1..row['c'].to_i-1).each do
          org_member = OrganizationMember.find_by(organization_id: row['organization_id'], member_id: row['member_id'])
          org_member.destroy
        end
      end
    end
    add_index :organization_members, [:organization_id, :member_id], unique: true
    add_index :conversation_members, [:conversation_id, :member_id], unique: true
  end
end
