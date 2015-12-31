# Example Structure for the redux store used in Sizung
    {
      selectedConversationId: 'conv1',
      conversationObjectsByConversation: {
        'conv1': {
          isFetching: true,
          nextPageUrl: 'http://sizung.com/.....',
          didInvalidate__not_used_yet__: false,
          lastUpdated__not_used_yet__: 1439478405547,
          references: [{id: '123', type: 'agendaItems'}, ...]
        }
      },
      agendaItemsByConversation: {
        'agen1': {
          isFetching: true,
          nextPageUrl: 'http://sizung.com/.....',
          didInvalidate__not_used_yet__: false,
          lastUpdated__not_used_yet__: 1439478405547,
          references: [{id: '123', type: 'comments'}, ...]
        }
      },
      entities: {
        conversations: {
          'conv1': {
            id: 'conv1',
            title: 'First conversation',
            organizationId: '673r7y87ywihriowy3'
          }
        },
        comments: {
          'comm1': {
            id: 'comm1',
            conversation_id: 'conv1',
            body: 'Hello World!',
            authorId: 'auth1',
            createdAt: '1776748393',
            updatedAt: '1776748393'
          }
        },
        users: {
          'user1': {
            id: 'user1',
            firstName: 'Sam',
            lastName: 'Sample',
            email: 'sam.sample@example.com'
          }
        },
        agendaItems: {
          'agen1': {
            id: 'agen1',
            conversationId: 'conv1',
            title: 'First Agenda Item'
          }
        },
        deliverables: {
          'deli1': {
            id: 'deli1',
            conversationId: 'conv1',
            title: 'First Deliverable'
          }
        }
      }
    }
