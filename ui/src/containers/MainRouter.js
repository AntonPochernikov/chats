import { connect } from 'react-redux';
import * as actionCreators from '../actions';
import * as select from '../selectors';
import MainRouter from '../components/MainRouter';

const mapStateToProps = state => ({
  user: select.getUserName(state),
});

export default connect(mapStateToProps, actionCreators)(MainRouter);
