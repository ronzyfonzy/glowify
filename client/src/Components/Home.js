import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Jumbotron, Container, Tooltip } from 'reactstrap'
import './Home.css'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = {
      tooltipOpen: false,
    }
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    })
  }

  render() {
    return (
      <>
        <Jumbotron fluid>
          <Container fluid>
            <h1 className="display-4">
              Welcome to <span className="glow">Glowify</span>{' '}
              <span role="img" aria-label="gold medal">
                🥇
              </span>
              <span role="img" aria-label="squid">
                🦑
              </span>
            </h1>
            <p className="lead">A GitKraken Glo middleware to add gamification to your Glo Boards</p>
          </Container>
        </Jumbotron>
        <h4>What it does</h4>
        <p>
          Glowify listens to changes that a user does on one (Listen) board and gives points to that user. Then it shows
          the score on the second (Publish) board as a card. Each change gives the user additional points. Once the
          users achieves enough points he ascends to a higher level (Column).
        </p>
        <h4>
          How to get up and running{' '}
          <span role="img" aria-label="man runner">
            🏃‍♂️
          </span>
        </h4>
        <p>
          To enable gamification on your Glo Boards you have to follow the steps bellow BUT if you are like me and don't
          like to read to much you can check out{' '}
          <a href="https://nimb.ws/7JgYce" target="_blank" rel="noopener noreferrer">
            this video
          </a>
          .
        </p>
        <ol>
          <li>Firstly create two boards in GitKraken Glo.</li>
          <li>
            <Link to="/signup">Create an account</Link>
          </li>
          <li>
            <Link to="/login">Login</Link> to Glowify
          </li>
          <li>
            Go to <Link to="/user">user preferences</Link> and set the Personal Access Token (PAT). More on generating
            PAT's read{' '}
            <a href="https://support.gitkraken.com/developers/pats/" target="_blank" rel="noopener noreferrer">
              here
            </a>
          </li>
          <li>
            Got to <Link to="/glowifys">Glowifys</Link> subpage and click on{' '}
            <Link to="/glowify-add">Glowify new Board</Link>
          </li>
          <li>
            Select a{' '}
            <span style={{ textDecoration: 'underline', color: 'blue' }} href="#" id="DisabledAutoHideExample">
              Listen and a Publish Board
            </span>{' '}
            and click Add.{' '}
            <span role="img" aria-label="man runner">
              ⚠️
            </span>
            <Tooltip
              placement="top"
              isOpen={this.state.tooltipOpen}
              autohide={false}
              target="DisabledAutoHideExample"
              toggle={this.toggle}
            >
              Listen board is the board which Glowify will receive events. Upon processing the events Glowify will
              publish the results to the Publish Board
            </Tooltip>
            Content in the Publish board will be deleted
          </li>
          <li>
            For the selected Listen Board{' '}
            <a
              href="https://support.gitkraken.com/developers/webhooks/set-up/#editing-and-managing-a-webhook"
              target="_blank"
              rel="noopener noreferrer"
            >
              create a webhook
            </a>
            . Use the information provided on <Link to="/glowifys">Glowifys</Link> to set the Payload URL and Secret
          </li>
          <li>
            Thats it{' '}
            <span role="img" aria-label="sign of the horns">
              🤘
            </span>
            . Users on the Listen board can start making changes and each change (comment, card move, new column, ...)
            will add points to the users card on the Publish board
          </li>
        </ol>
        <h4>Things that still need to be done</h4>
        <ul>
          <li>Points editor: enable users to edit how many points is an event worth</li>
          <li>Security improvements (database and API)</li>
        </ul>
      </>
    )
  }
}
