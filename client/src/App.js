import React from 'react'
import { withRouter } from 'react-router-dom'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { Container } from 'reactstrap'
import Navigation from './Components/Navigation'
import Session from './Components/Session'
import Home from './Components/Home'
import User from './Components/User'
import Signup from './Components/Signup'
import Login from './Components/Login'
import Glowifys from './Components/Glowifys'
import AddGlowify from './Components/AddGlowify'
import EventTypes from './Components/EventTypes'

const NavigationRouter = withRouter(Navigation)

function AuthExample() {
  return (
    <Router>
      <Container>
        <NavigationRouter />
        <Route path="/" exact component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/user" component={User} />
        <PrivateRoute path="/glowifys" component={Glowifys} />
        <PrivateRoute path="/glowify-add" component={AddGlowify} />
        <PrivateRoute path="/event-types" component={EventTypes} />
      </Container>
    </Router>
  )
}

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        Session.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  )
}

export default AuthExample
