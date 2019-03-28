import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Table } from 'reactstrap'
import Session from './Session'

export default class EventTypes extends Component {
  constructor(props) {
    super(props)
    this.state = { redirectToReferrer: null, eventTypes: [] }
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_CLIENT_SERVER_URL}/event-types`, {
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
          eventTypes: response.data.eventTypes,
        })
      })
      .catch(error => {
        console.error(error)
      })
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
              <th>Event</th>
              <th>Action</th>
              <th>Points Gained</th>
            </tr>
          </thead>
          <tbody>
            {this.state.eventTypes.map(eventType => (
              <tr key={eventType.id}>
                <td>{eventType.id}</td>
                <td>{eventType.event}</td>
                <td>{eventType.type}</td>
                <td>{eventType.points}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    )
  }
}
