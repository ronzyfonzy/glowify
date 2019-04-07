import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Form, FormGroup, Label, Input, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import Session from './Session'

export default class User extends Component {
  constructor(props) {
    super(props)
    this.state = { keyChaned: false, gloApiKey: '' }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    const keyChaned = this.state[name] !== value

    this.setState({
      [name]: value,
      keyChaned,
    })
  }

  handleKeyPress(target) {
    if (target.charCode === 13) {
      this.save()
    }
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_CLIENT_API_URL}/user-preferences`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) {
          Session.removeSession()
          this.setState({
            redirectToReferrer: '/login',
          })
          throw new Error('Unauthorized')
        } else {
          throw new Error(response.json())
        }
      })
      .then(response => {
        this.setState({
          gloApiKey: response.gloApiKey || '',
        })
      })
      .catch(error => {
        console.error({ error })
      })
  }

  save = () => {
    Session.savePreferences(this.state.gloApiKey).then(res => {
      this.setState({
        keyChaned: false,
      })
    })
  }

  render() {
    let { redirectToReferrer } = this.state
    let { from } = this.props.location.state || { from: { pathname: redirectToReferrer } }

    if (redirectToReferrer) return <Redirect to={from} />

    return (
      <>
        <Breadcrumb>
          <BreadcrumbItem>User</BreadcrumbItem>
          <BreadcrumbItem active>Preferences</BreadcrumbItem>
        </Breadcrumb>
        <Form>
          <FormGroup>
            <Label for="gloApiKey">
              Personal Access Token{' '}
              <small>
                <a href="https://app.gitkraken.com/pats" target="_blank" rel="noopener noreferrer">
                  (get PAT)
                </a>
              </small>
            </Label>
            <Input
              type="text"
              name="gloApiKey"
              value={this.state.gloApiKey}
              onChange={this.handleInputChange}
              onKeyPress={this.handleKeyPress}
            />
          </FormGroup>
          <Button onClick={this.save} color={this.state.keyChaned ? 'success' : 'secondary'}>
            Save
          </Button>
        </Form>
      </>
    )
  }
}
