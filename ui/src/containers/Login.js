import { connect } from 'react-redux';
import * as actionCreators from '../actions';
import * as select from '../selectors';
import Login from '../components/Login';

const mapStateToProps = (state) => ({
  loginState: select.getUserLoginState(state)
});

export default connect(mapStateToProps, actionCreators)(Login);
