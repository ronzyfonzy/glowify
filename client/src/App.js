import React from 'react'
import { withRouter, Switch } from 'react-router-dom'
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
import Achievements from './Components/Achievements'
import Ranks from './Components/Ranks'
import Route404 from './Components/Route404'
// import Footer from './Components/Footer'

const NavigationRouter = withRouter(Navigation)

function AuthExample() {
  return (
    <Router>
      <Container>
        <NavigationRouter />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/home" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/user" exact component={User} />
          <PrivateRoute path="/glowifys" exact component={Glowifys} />
          <PrivateRoute path="/glowify-add" exact component={AddGlowify} />
          <PrivateRoute path="/event-types" exact component={EventTypes} />
          <PrivateRoute path="/achievements" exact component={Achievements} />
          <PrivateRoute path="/ranks" exact component={Ranks} />
          <Route component={Route404} />
        </Switch>
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
