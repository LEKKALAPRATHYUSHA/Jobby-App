import {Route, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = props => {
  const {component: Component, ...rest} = props
  const token = Cookies.get('jwt_token')

  return (
    <Route
      {...rest}
      render={routeProps =>
        token ? <Component {...routeProps} /> : <Redirect to="/login" />
      }
    />
  )
}

export default ProtectedRoute