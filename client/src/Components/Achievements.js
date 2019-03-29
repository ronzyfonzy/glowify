import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Table, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import Session from './Session'

export default class Achievements extends Component {
  constructor(props) {
    super(props)
    this.state = { redirectToReferrer: null, achievements: [] }
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_CLIENT_SERVER_URL}/achievements`, {
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
          achievements: response.data.achievements,
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
        <Breadcrumb>
          <BreadcrumbItem>Gamification</BreadcrumbItem>
          <BreadcrumbItem active>Achievements</BreadcrumbItem>
        </Breadcrumb>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Minimimal Events</th>
            </tr>
          </thead>
          <tbody>
            {this.state.achievements.map(achievement => (
              <tr key={achievement.id}>
                <td>{achievement.id}</td>
                <td>{achievement.title}</td>
                <td>{achievement.description}</td>
                <td>{achievement.minEvents}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    )
  }
}
