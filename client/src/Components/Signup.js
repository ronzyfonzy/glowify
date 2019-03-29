import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Form, FormGroup, Label, Input, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import Session from './Session'

export default class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = { username: '', password: '', email: '' }

    if (process.env.REACT_APP_ENV === 'develop') {
      this.state = {
        username: new Date().getTime(),
        password: new Date().getTime(),
        email: `${new Date().getTime()}@test.com`,
      }
    }
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value,
    })
  }

  signup = () => {
    Session.signup(this.state.username, this.state.email, this.state.password)
      .then(() => {
        this.setState({
          redirectToReferrer: '/login',
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    let { redirectToReferrer } = this.state
    let { from } = this.props.location.state || { from: { pathname: redirectToReferrer } }

    if (redirectToReferrer) return <Redirect to={from} />

    return (
      <>
        <Breadcrumb>
          <BreadcrumbItem active>Signup</BreadcrumbItem>
        </Breadcrumb>
        <Form>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input type="text" name="username" value={this.state.username} onChange={this.handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" name="email" value={this.state.email} onChange={this.handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" name="password" value={this.state.password} onChange={this.handleInputChange} />
          </FormGroup>
          <Button onClick={this.signup}>Signup</Button>
        </Form>
      </>
    )
  }
}
