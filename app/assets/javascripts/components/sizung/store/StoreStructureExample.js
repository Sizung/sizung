export default class {
  exaple() {
    return {
      selectedConversationId: 'conv1',
      commentsByConversation: {
        'conv1': {
          isFetching: true,
          didInvalidate: false,
          lastUpdated: 1439478405547,
          items: ['comm1']
        }
      },
      agendaItemsByConversation: {
        'conv1': {
          isFetching: true,
          didInvalidate: false,
          lastUpdated: 1439478405547,
          items: ['agen1']
        }
      },
      deliverablesByConversation: {
        'conv1': {
          isFetching: true,
          didInvalidate: false,
          lastUpdated: 1439478405547,
          items: ['deli1']
        }
      },
      entities: {
        conversations: {
          'conv1': {
            id: 'conv1',
            title: 'First conversation',
            organization_id: '673r7y87ywihriowy3'
          }
        },
        comments: {
          'comm1': {
            id: 'comm1',
            conversation_id: 'conv1',
            body: 'Hello World!',
            author_id: 'auth1',
            created_at: '1776748393',
            updated_at: '1776748393'
          }
        },
        users: {
          'user1': {
            id: 'user1',
            first_name: 'Sam',
            last_name: 'Sample',
            email: 'sam.sample@example.com'
          }
        },
        agenda_items: {
          'agen1': {
            id: 'agen1',
            conversation_id: 'conv1',
            title: 'First Agenda Item'
          }
        },
        deliverables: {
          'deli1': {
            id: 'deli1',
            conversation_id: 'conv1',
            title: 'First Deliverable'
          }
        }
      }
    }
  }
}
