import React, { PropTypes } from 'react';
import styles from './SignIn.scss';
import { getCSRFToken } from '../../utils/MetaTagsManager';


class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = { authenticityToken: null };
  }

  componentDidMount() {
    this.setState({ authenticityToken: getCSRFToken() });
  }

  render() {
    return (
      <div className={styles.rowContainer}>
        <div className={styles.root}>
          <div className={styles.logo}>Sizung</div>
          <div className={styles.title}>Sign in</div>
          <form action="/users/sign_in" acceptCharset="UTF-8" method="post" className={styles.fieldset}>
            <input name="utf8" type="hidden" value="✓" />
            <div className={styles.hint}>Enter your email id and password</div>
            <input type="hidden" name="authenticity_token" value={ this.state.authenticityToken } />
            <input id="user_email" type="email" name="user[email]" placeholder="name@email.com" />
            <input id="user_password" type="password" name="user[password]" placeholder="password" />
            <input type="submit" name="commit" value="Log in" className={styles.button} />
            <a className={styles.forgottenPasswordLink} href="/users/password/new">I've forgotten my password</a>
          </form>
          <a className={styles.signUpLink} href="/signup">Create a new team on Sizung</a>
        </div>
      </div>
    );
  }
}

export default SignIn;
