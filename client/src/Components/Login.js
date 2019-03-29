import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Form, FormGroup, Label, Input, Alert, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import Session from './Session'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = { authError: null, username: '', password: '' }

    if (process.env.REACT_APP_ENV === 'develop') {
      this.state = { authError: null, username: 'username', password: 'password' }
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value,
    })
  }

  handleKeyPress(target) {
    if (target.charCode === 13) {
      this.login()
    }
  }

  login = () => {
    Session.login(this.state.username, this.state.password)
      .then(response => {
        this.setState({
          authError: response.error !== undefined ? response.error : null,
        })
      })
      .catch(error => {
        console.log({ error })
      })
  }

  render() {
    let { from } = this.props.location.state || { from: { pathname: '/glowifys' } }

    if (Session.isAuthenticated) return <Redirect to={from} />

    return (
      <>
        <Breadcrumb>
          <BreadcrumbItem active>Login</BreadcrumbItem>
        </Breadcrumb>
        <Alert color="danger" hidden={true}>
          You must log in to view the page at {from.pathname}
        </Alert>
        <Form>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleInputChange}
              onKeyPress={this.handleKeyPress}
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleInputChange}
              onKeyPress={this.handleKeyPress}
            />
          </FormGroup>
          <Button onClick={this.login}>Log in</Button>
          <Alert className="mt-3" color="danger" hidden={this.state.authError === null}>
            {this.state.authError}
          </Alert>
        </Form>
      </>
    )
  }
}
