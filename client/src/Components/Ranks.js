import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Table, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import Session from './Session'

export default class Ranks extends Component {
  constructor(props) {
    super(props)
    this.state = { redirectToReferrer: null, ranks: [] }
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_CLIENT_SERVER_URL}/ranks`, {
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
          ranks: response.data.ranks,
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
          <BreadcrumbItem active>Ranks</BreadcrumbItem>
        </Breadcrumb>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Position</th>
              <th>Minimimal Points</th>
            </tr>
          </thead>
          <tbody>
            {this.state.ranks.map(rank => (
              <tr key={rank.id}>
                <td>{rank.id}</td>
                <td>{rank.name}</td>
                <td>{rank.position}</td>
                <td>{rank.minPoints}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    )
  }
}
