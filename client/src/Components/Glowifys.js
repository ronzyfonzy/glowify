import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { Input, Label, Button, Table, InputGroup, InputGroupAddon, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import Session from './Session'

export default class Glowify extends Component {
  constructor(props) {
    super(props)
    this.state = { glowifys: [], isSecretHidden: true, copyToggler: false }
    this.toggleShow = this.toggleShow.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.copyToClipboard = this.copyToClipboard.bind(this)
  }

  componentDidMount() {
    setInterval(() => this.setState({ copyToggler: false }), 2000)

    fetch(`${process.env.REACT_APP_CLIENT_API_URL}/glowify`, {
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
        } else {
          throw new Error(response.json())
        }
      })
      .then(response => {
        this.setState({
          glowifys: response.data.glowify,
        })
      })
      .catch(error => {
        console.error(error)
      })
  }

  setActive(id, isActive) {
    fetch(`${process.env.REACT_APP_CLIENT_API_URL}/glowify`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        isActive,
      }),
    })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) {
          Session.removeSession()
          this.setState({
            redirectToReferrer: '/login',
          })
        } else {
          throw new Error(response.json())
        }
      })
      .then(response => {
        this.setState({
          glowifys: this.state.glowifys.map(glowify => {
            if (glowify.id === response.data.glowify.id) {
              glowify.isActive = response.data.glowify.isActive
            }
            return glowify
          }),
        })
      })
      .catch(error => {
        console.error(error)
      })
  }

  toggleShow(id) {
    this.setState({ isSecretHidden: !this.state.isSecretHidden })
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setActive(+name, value)
  }

  copyToClipboard = (id, secret) => {
    const textField = document.createElement('textarea')
    textField.innerText = secret
    const parentElement = document.getElementById('copy-container')
    parentElement.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    parentElement.removeChild(textField)
    this.setState({ copyToggler: id })
  }

  render() {
    let { redirectToReferrer } = this.state
    let { from } = this.props.location.state || { from: { pathname: redirectToReferrer } }

    if (redirectToReferrer) return <Redirect to={from} />

    return (
      <>
        <Breadcrumb>
          <BreadcrumbItem active>Glowifys</BreadcrumbItem>
        </Breadcrumb>
        <div id="copy-container" />
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Listen Board</th>
              <th>Payload URL</th>
              <th>Secret</th>
              <th>Publish Board</th>
              <th>Logged Events Count</th>
              <th>Is Active</th>
            </tr>
          </thead>
          <tbody>
            {this.state.glowifys.map(glowify => (
              <tr key={glowify.id} className={glowify.isActive ? '' : 'table-active'}>
                <td>{glowify.id}</td>
                <td>{glowify.listenBoard.name}</td>
                <td>{glowify.webhookUrl}</td>
                <td>
                  <InputGroup>
                    <Input type={this.state.isSecretHidden ? 'password' : 'text'} defaultValue={glowify.secret} />
                    {document.queryCommandSupported('copy') ? (
                      <InputGroupAddon addonType="append">
                        <Button
                          onClick={e => this.copyToClipboard(glowify.id, glowify.secret)}
                          color={this.state.copyToggler === glowify.id ? 'success' : 'secondary'}
                        >
                          Copy
                        </Button>
                      </InputGroupAddon>
                    ) : (
                      <InputGroupAddon addonType="append" hidden={true}>
                        <Button onClick={this.toggleShow}>Show/Hide</Button>
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                </td>
                <td>{glowify.publishBoard.name}</td>
                <td>{glowify.eventCounter.count}</td>
                <td>
                  <InputGroup>
                    <Label check>
                      <Input
                        type="checkbox"
                        name={glowify.id}
                        onChange={this.handleInputChange}
                        defaultChecked={glowify.isActive}
                      />
                    </Label>
                  </InputGroup>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="7">
                <Button tag={Link} to="/glowify-add" color="primary" block>
                  Glowify new Board
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </>
    )
  }
}
