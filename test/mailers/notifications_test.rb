require 'test_helper'

describe Notifications do
  
  it 'mentioned inside conversation' do
    user = FactoryGirl.create :user
    actor = FactoryGirl.create :user
    mentionable = FactoryGirl.create :comment, body: "This is a mention test for @[Sam Sample](#{user.id})"
    mail = Notifications.mentioned(user, mentionable, actor, 'sampleurl.example.com')

    value(mail.to).must_equal [user.email]
    value(mail.from).must_equal ['Sizung']
    value(mail.subject).must_equal "#{actor.first_name} mentioned you in #{mentionable.commentable.title}"
    value(mail.body.encoded).must_match "#{actor.name} mentioned you in"
    value(mail.body.encoded).must_match 'This is a mention test for Sam Sample'
    value(mail.body.encoded).must_match 'sampleurl.example.com'
  end

  it 'mentioned inside agenda item' do
    user = FactoryGirl.create :user
    actor = FactoryGirl.create :user
    agenda_item = FactoryGirl.create :agenda_item
    mentionable = FactoryGirl.create :comment, body: "This is a mention test for @[Sam Sample](#{user.id})"
    mentionable.commentable = agenda_item
    mail = Notifications.mentioned(user, mentionable, actor, 'sampleurl.example.com')

    value(mail.to).must_equal [user.email]
    value(mail.from).must_equal ['Sizung']
    value(mail.subject).must_equal "#{actor.first_name} mentioned you about #{mentionable.commentable.title} in #{mentionable.commentable.parent.title}"
    value(mail.body.encoded).must_match "#{actor.name} mentioned you in"
    value(mail.body.encoded).must_match 'This is a mention test for Sam Sample'
    value(mail.body.encoded).must_match 'sampleurl.example.com'
  end

  it 'mentioned inside deliverable attached to agenda item' do
    user = FactoryGirl.create :user
    actor = FactoryGirl.create :user
    deliverable = FactoryGirl.create :deliverable
    mentionable = FactoryGirl.create :comment, body: "This is a mention test for @[Sam Sample](#{user.id})"
    mentionable.commentable = deliverable
    mail = Notifications.mentioned(user, mentionable, actor, 'sampleurl.example.com')

    value(mail.to).must_equal [user.email]
    value(mail.from).must_equal ['Sizung']
    value(mail.subject).must_equal "#{actor.first_name} mentioned you about #{mentionable.commentable.title} in #{mentionable.commentable.parent.parent.title}"
    value(mail.body.encoded).must_match "#{actor.name} mentioned you in"
    value(mail.body.encoded).must_match 'This is a mention test for Sam Sample'
    value(mail.body.encoded).must_match 'sampleurl.example.com'
  end

  it 'mentioned inside deliverable attached to conversation' do
    user = FactoryGirl.create :user
    actor = FactoryGirl.create :user
    deliverable = FactoryGirl.create :deliverable
    deliverable.parent = deliverable.parent.parent
    mentionable = FactoryGirl.create :comment, body: "This is a mention test for @[Sam Sample](#{user.id})"
    mentionable.commentable = deliverable
    mail = Notifications.mentioned(user, mentionable, actor, 'sampleurl.example.com')

    value(mail.to).must_equal [user.email]
    value(mail.from).must_equal ['Sizung']
    value(mail.subject).must_equal "#{actor.first_name} mentioned you about #{mentionable.commentable.title} in #{mentionable.commentable.parent.title}"
    value(mail.body.encoded).must_match "#{actor.name} mentioned you in"
    value(mail.body.encoded).must_match 'This is a mention test for Sam Sample'
    value(mail.body.encoded).must_match 'sampleurl.example.com'
  end

  it 'deliverable attached to agenda item assigned ' do
    actor       = FactoryGirl.create :user
    assignee    = FactoryGirl.create :user
    deliverable = FactoryGirl.create :deliverable, assignee: assignee
    mail        = Notifications.deliverable_assigned(deliverable, actor)
    body        = mail.body.encoded

    value(mail.to).must_equal [assignee.email]
    value(mail.from).must_equal ['Sizung']
    value(mail.subject).must_equal "#{actor.first_name} assigned an action to you in #{deliverable.parent.parent.title}"
    value(body).must_match "Hi #{assignee.first_name},"
    value(body).must_match "#{actor.name} assigned you an action: #{deliverable.title}"
    value(body).must_match "http://localhost:3000/deliverables/#{deliverable.id}"
  end

  it 'deliverable attached to conversation assigned ' do
    actor       = FactoryGirl.create :user
    assignee    = FactoryGirl.create :user
    deliverable = FactoryGirl.create :deliverable, assignee: assignee
    deliverable.parent = deliverable.parent.parent
    mail        = Notifications.deliverable_assigned(deliverable, actor)
    body        = mail.body.encoded

    value(mail.to).must_equal [assignee.email]
    value(mail.from).must_equal ['Sizung']
    value(mail.subject).must_equal "#{actor.first_name} assigned an action to you in #{deliverable.parent.title}"
    value(body).must_match "Hi #{assignee.first_name},"
    value(body).must_match "#{actor.name} assigned you an action: #{deliverable.title}"
    value(body).must_match "http://localhost:3000/deliverables/#{deliverable.id}"
  end

  it 'agenda_item_assigned' do
    actor       = FactoryGirl.create :user
    owner       = FactoryGirl.create :user
    agenda_item = FactoryGirl.create :agenda_item, owner: owner
    mail        = Notifications.agenda_item_assigned(agenda_item, actor)
    body        = mail.body.encoded

    value(mail.to).must_equal [owner.email]
    value(mail.from).must_equal ['Sizung']
    value(mail.subject).must_equal "#{actor.first_name} assigned a priority to you"
    value(body).must_match "Hi #{owner.first_name},"
    value(body).must_match "#{actor.name} made you the owner of an agenda item: #{agenda_item.title}"
    value(body).must_match "http://localhost:3000/agenda_items/#{agenda_item.id}"
  end
end
