import { connect } from 'react-redux';
import FilterableDropdown from '../components/FilterableDropdown';
import * as selectors from '../utils/selectors';

function mapStateToProps(state, props) {
  const { conversationId } = props;

  return {
    items: props.conversations,
    item: conversationId && props.conversations   ? props.conversations.filter((item) => {return item.id === conversationId}).first() : selectors.currentConversation(state),
    type: 'Conversation',
  };
}

export default connect(mapStateToProps)(FilterableDropdown);
