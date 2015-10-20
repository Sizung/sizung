export default class {
  exaple() {
    var example = {
      selectedTodoList: 'tl-1',
      todosByTodoList: {
        'tl-1': {
          lastUpdated: 1439478405547,
          items: ['t-1', 't-2']
        }
      },
      attachmentsByTodo: {
        't-1': {
          lastUpdated: 1439478405547,
          items: ['a-1']
        }
      },
      entities: {
        todoLists: {
          'tl-1': {
            id: 'tl-1',
            title: 'First TodoList'
          }
        },
        todos: {
          't-1': {
            id: 't-1',
            todoListId: 'tl-1',
            summary: 'First Task'
          },
          't-2': {
            id: 't-2',
            todoListId: 'tl-1',
            summary: 'Second Task'
          }
        },
        attachments: {
          'a-1': {
            id: 'a-1',
            url: 'http://example.come/file123.pdf?token=456'
          }
        }
      }
    };

    var exampleInline = {
      selectedTodoList: 'tl-1',
      entities: {
        todoLists: {
          'tl-1': {
            id: 'tl-1',
            title: 'First TodoList',
            todos: {
              lastUpdated: 1439478405547,
              items: ['t-1', 't-2']
            }
          }
        },
        todos: {
          't-1': {
            id: 't-1',
            todoListId: 'tl-1',
            summary: 'First Task',
            attachments: {
              lastUpdated: 1439478405547,
              items: ['a-1']
            }
          },
          't-2': {
            id: 't-2',
            todoListId: 'tl-1',
            summary: 'Second Task'
          }
        },
        attachments: {
          'a-1': {
            id: 'a-1',
            url: 'http://example.come/file123.pdf?token=456'
          }
        }
      }
    };


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
