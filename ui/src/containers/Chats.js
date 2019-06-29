import { connect } from 'react-redux';
import * as actionCreators from '../actions';
import * as select from '../selectors';
import Chats from '../components/Chats';

const mapStateToProps = (state) => ({
  userName: select.getUserName(state),
  messages: select.getMessages(state),
  loadingState: select.getMessagesFetchState(state),
});

export default connect(mapStateToProps, actionCreators)(Chats);
