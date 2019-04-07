import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Jumbotron } from 'reactstrap'

export default class Route404 extends Component {
  render() {
    return (
      <Jumbotron>
        <h1 className="display-2 text-center">
          <span role="img" aria-label="shrug woman">
            🤷‍♀
          </span>
          <span role="img" aria-label="shrug man">
            ️🤷‍♂️
          </span>
        </h1>
        <h2 className="display-4 text-center">404 - Page can't be found</h2>
        <p className="text-center">
          <Link className="btn btn-primary" to="/home">
            Take me Home{' '}
            <span role="img" aria-label="home">
              ️🏠
            </span>
          </Link>
        </p>
      </Jumbotron>
    )
  }
}
