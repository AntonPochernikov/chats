import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Login from '../containers/Login';
import Chats from '../containers/Chats';
import './MainRouter.css';

export default class MainRouter extends React.Component {
  renderChat = () => this.props.user ? <Chats /> : <Redirect to="/login" />
  renderLogin = () => this.props.user ? <Redirect to="/chat" /> : <Login />
  renderRoot = () => <Redirect to="/login" />

  render() {
    return (
      <Router>
        <div className="main-container">
          <Typography variant="h2" component="h1">Chats</Typography>
          {this.props.user && (
            <div className="logout-btn-container">
              <Button
                onClick={this.props.logoutUser}
                type="button"
                size="medium"
              >
                logout
              </Button>
            </div>
          )}
          <Switch>
            <Route path="/login" render={this.renderLogin} />
            <Route path="/chat" render={this.renderChat} />
            <Route render={this.renderRoot} />
          </Switch>
        </div>
      </Router>
    );
  }
}
