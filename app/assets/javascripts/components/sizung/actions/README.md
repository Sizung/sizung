## Action Creators

|
V

user submits a new comment

|
V

Callback is called

|
V

createComment(comment: {body: 'Hello World', conversationId: '134'}):
  does the post ajax call to the server (ASYNC)
  
  CREATE_COMMENT
    status: 'IN_PROGRESS' || 'SUCCESS' || 'FAILURE' || 'REMOTE_ORIGIN'

  UPDATE_COMMENT
    status: 'IN_PROGRESS' || 'SUCCESS' || 'FAILURE' || 'REMOTE_ORIGIN'
    
  DELETE_COMMENT
    status: 'IN_PROGRESS' || 'SUCCESS' || 'FAILURE' || 'REMOTE_ORIGIN'

  FETCH_COMMENTS_BY_CONVERSATION
    status: 'IN_PROGRESS' || 'SUCCESS' || 'FAILURE'

