import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { Input, Button, Table, InputGroup, InputGroupAddon } from 'reactstrap'
import Session from './Session'

export default class Glowify extends Component {
  constructor(props) {
    super(props)
    this.state = { glowifys: [], isSecretHidden: true }
    this.toggleShow = this.toggleShow.bind(this)
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_CLIENT_SERVER_URL}/glowify`, {
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

  toggleShow(id) {
    this.setState({ isSecretHidden: !this.state.isSecretHidden })
  }

  render() {
    let { redirectToReferrer } = this.state
    let { from } = this.props.location.state || { from: { pathname: redirectToReferrer } }

    if (redirectToReferrer) return <Redirect to={from} />

    return (
      <>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Listen Board</th>
              <th>Payload URL</th>
              <th>Secret</th>
              <th>Publish Board</th>
              <th>Logged Events Count</th>
            </tr>
          </thead>
          <tbody>
            {this.state.glowifys.map(glowify => (
              <tr key={glowify.id}>
                <td>{glowify.id}</td>
                <td>{glowify.listenBoard.name}</td>
                <td>{glowify.webhookUrl}</td>
                <td>
                  <InputGroup>
                    <Input type={this.state.isSecretHidden ? 'password' : 'text'} defaultValue={glowify.secret} />
                    <InputGroupAddon addonType="append">
                      <Button onClick={this.toggleShow}>Show / Hide</Button>
                    </InputGroupAddon>
                  </InputGroup>
                </td>
                <td>{glowify.publishBoard.name}</td>
                <td>{glowify.eventCounter.count}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="6">
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
