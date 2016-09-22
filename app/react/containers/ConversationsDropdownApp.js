import { connect } from 'react-redux';
import FilterableDropdown from '../components/FilterableDropdown';
import * as selectors from '../utils/selectors';

function mapStateToProps(state, props) {
  const { conversationId } = props;
  console.log('Conversation dropdwon conversationId: ', conversationId);
  return {
    items: props.conversations,
    //item: conversationId && props.conversations ? props.conversations.filter((item) => {return item.id === conversationId}).first() : selectors.currentConversation(state),
    item: conversationId && props.conversations ? props.conversations.filter((item) => {return item.id === conversationId}).first() : undefined,
    type: 'Conversation',
  };
}

export default connect(mapStateToProps)(FilterableDropdown);
