require 'test_helper'

describe Notifications do
  
  it 'mentioned' do
    user = FactoryGirl.create :user
    actor = FactoryGirl.create :user
    mentionable = FactoryGirl.create :comment, body: "This is a mention test for @[Sam Sample](#{user.id})"
    mail = Notifications.mentioned(user, mentionable, actor, 'sampleurl.example.com')
    value(mail.subject).must_equal "#{actor.first_name} mentioned you"
    value(mail.to).must_equal [user.email]
    value(mail.from).must_equal ['no-reply@sizung.com']
    value(mail.body.encoded).must_match "#{actor.name} mentioned you in"
    value(mail.body.encoded).must_match 'This is a mention test for Sam Sample'
    value(mail.body.encoded).must_match 'sampleurl.example.com'
  end

  it 'deliverable_assigned' do
    actor       = FactoryGirl.create :user
    assignee    = FactoryGirl.create :user
    deliverable = FactoryGirl.create :deliverable, assignee: assignee
    mail        = Notifications.deliverable_assigned(deliverable, actor)
    body        = mail.body.encoded

    value(mail.to).must_equal [assignee.email]
    value(mail.from).must_equal ['no-reply@sizung.com']
    value(mail.subject).must_equal "#{actor.first_name} assigned a deliverable to you"
    value(body).must_match "Hi #{assignee.first_name},"
    value(body).must_match "#{actor.name} assigned you an action: #{deliverable.title}"
    value(body).must_match "http://localhost:3000/deliverables/#{deliverable.id}"
  end
end
