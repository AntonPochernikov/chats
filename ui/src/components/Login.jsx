import React from 'react';
import { Form, Field } from 'react-final-form';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './Login.css';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }

  handleSubmit = (values) => {
    this.props.loginUserRequest(values);
  }

  render() {
    const { loginState } = this.props;
    return (
      <Form
        onSubmit={this.handleSubmit}
        render={({ handleSubmit, invalid }) => (
          <form className="login-form" onSubmit={handleSubmit}>
            <Field
              name="user"
              validate={(value) => {
                if (value === undefined) {
                  return 'Input is required'
                }
              }}
              render={({ input }) => (
                <div className="input-container">
                  <TextField
                    {...input}
                    inputRef={this.inputRef}
                    label="Enter users name"
                    variant="outlined"
                    disabled={loginState === 'requested'}
                    fullWidth
                    required
                  />
                </div>
              )}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
              disabled={invalid || loginState === 'requested'}
            >
              Submit
            </Button>
          </form>
        )}
      />
    );
  }
}
