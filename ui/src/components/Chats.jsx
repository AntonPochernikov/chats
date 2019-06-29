import React from 'react';
import { Form, Field } from 'react-final-form';
import anime from 'animejs';
import cn from 'classnames';
import { format as formatDate } from 'date-fns';

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import './Chats.css';

export default class Chats extends React.Component {
  constructor(props) {
    super(props);

    this.chatRef = React.createRef();
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    this.props.fetchMessagesRequest();

    this.chatRef.current.addEventListener('scroll', this.handleScrollTop);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loadingState === 'requested' && this.props.loadingState === 'succeed') {
      anime({
        targets: this.chatRef.current,
        scrollTop: this.chatRef.current.scrollHeight,
        duration: 0,
        easing: 'easeInOutQuad'
      });
      this.inputRef.current.focus();
    }
  }

  componentWillUnmount() {
    this.chatRef.current.removeEventListener('scroll', this.handleScrollTop);
  }

  handleScrollTop = (e) => {
    if (e.target.scrollTop <= 30 && this.props.loadingState === 'succeed') {
      this.props.fetchMessagesRequest();
    }
  }

  handleMessageSend = ({ message }, formAPI) => {
    this.props.sendSocketMessage({ message });
    formAPI.initialize({});
    this.inputRef.current.focus();
  }

  handleRefreshBtn = () => {
    this.props.fetchMessagesRequest();
  }

  renderChatbox() {
    const { messages, loadingState, userName } = this.props;
    if (loadingState === 'requested') {
      return <LinearProgress />
    }
    if (loadingState === 'failed') {
      return (
        <>
          <p>Failed to load messages.</p>
          <Button onClick={this.handleRefreshBtn} variant="contained">Refresh</Button>
        </>
      )
    }
    if (messages.length === 0) {
      return <p>There are no messages yet</p>;
    }

    return messages.map(({ id, user, message, ts }, i) => {
      const messageClass = cn(
        'chat-message',
        { 'chat-message--user-message': user === userName },
      );

      return (
        <div key={id} className={messageClass}>
          {user !== userName && (
            <div className="chat-message__owner">{user}</div>
          )}
          <div className="chat-message__value">{message}</div>
          {ts && (
            <div className="chat-message__ts">{formatDate(ts, 'hh:mm:ss Do MMM')}</div>
          )}
        </div>
      )
    });
  }

  render() {
    const { loadingState } = this.props

    return (
      <div className="chats-container">
        <Paper>
          <div className="chat-box" ref={this.chatRef}>
            {loadingState === 'loadingMore' && (
              <div className="more-preloader">
                <CircularProgress />
              </div>
            )}
            {this.renderChatbox()}
          </div>
        </Paper>
        <Form
          onSubmit={this.handleMessageSend}
          render={({ handleSubmit, invalid }) => (
            <form className="chats-form" onSubmit={handleSubmit}>
              <Field
                name="message"
                validate={(value) => {
                  if (value === undefined) {
                    return 'Type message to send';
                  }
                }}
                render={({ input }) => (
                  <TextField
                    {...input}
                    inputRef={this.inputRef}
                    label="Your message"
                    margin="normal"
                    variant="filled"
                    disabled={loadingState !== 'succeed'}
                    required
                    fullWidth
                  />
                )}
              />
              <IconButton type="submit" aria-label="Delete" disabled={invalid || loadingState !== 'succeed'}>
                <SendIcon />
              </IconButton>
            </form>
          )}
        />
      </div>
    );
  }
}
