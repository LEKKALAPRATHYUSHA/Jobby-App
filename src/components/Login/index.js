import {Component} from 'react'
import Cookies from 'js-cookie'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showError: false,
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg, showError: true})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const response = await fetch('https://apis.ccbp.in/login', {
      method: 'POST',
      body: JSON.stringify({username, password}),
    })

    const data = await response.json()

    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, errorMsg, showError} = this.state

    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />

        <form onSubmit={this.onSubmitForm}>
          <label htmlFor="username">USERNAME</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={this.onChangeUsername}
          />

          <label htmlFor="password">PASSWORD</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={this.onChangePassword}
          />

          <button type="button">Login</button>

          {showError && <p>{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
