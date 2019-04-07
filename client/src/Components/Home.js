import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Jumbotron, Container } from 'reactstrap'
import { Player, BigPlayButton, ControlBar, ForwardControl } from 'video-react'

const glowStyle = {
  textShadow:
    '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #228dff, 0 0 35px #228dff, 0 0 40px #228dff, 0 0 50px #228dff, 0 0 75px #228dff',
}

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
          <Container fluid className="text-center">
            <h1 className="display-4">
              Welcome to <span style={glowStyle}>Glowify</span>{' '}
              <span role="img" aria-label="gold medal">
                🥇
              </span>
              <span role="img" aria-label="squid">
                🦑
              </span>
            </h1>
            <p className="lead">A service to add gamification to your Git Kraken Glo Boards</p>
          </Container>
        </Jumbotron>
        <h3>About</h3>
        <p>
          Glowify is a service that enables gamification of GitKraken Glo Boards. You define a Listen and Publish board
          and each user event done in the Listen board will be processed by Glowify. After the event is processed
          Glowify will post the results to the Publish board in form of levels (columns), user points (cards) and
          achievements (labels).
        </p>
        <h3>
          How to get up and running{' '}
          <span role="img" aria-label="man runner">
            🏃‍
          </span>
        </h3>
        <p>
          To enable gamification on your Glo Boards you have to follow the steps bellow BUT if you are like me and don't
          like to read to much you can check out the video bellow.
        </p>
        <ol>
          <li>
            <Link to="/signup">Create an account</Link> and <Link to="/login">Log into</Link> Glowify
          </li>
          <li>
            Go to <Link to="/user">user preferences</Link> and set the Personal Access Token (PAT) from GitKraken. More
            on generating PAT's read{' '}
            <a href="https://support.gitkraken.com/developers/pats/" target="_blank" rel="noopener noreferrer">
              here
            </a>
          </li>
          <li>
            Enable gamification to you board by <Link to="/glowify-add">adding new Glowify</Link>. Select a Listen and a
            Publish Board and click Add. If needed create a new Publish board.{' '}
            <span role="img" aria-label="warning">
              ⚠️
            </span>
            <span className="text-danger">Content in the Publish board will be deleted</span>
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
            . Use the information provided on <Link to="/glowifys">Glowifys list</Link> to set the Payload URL and
            Secret
          </li>
          <li>
            That's it{' '}
            <span role="img" aria-label="sign of the horns">
              🤘
            </span>
            . Users on the Listen board can start making changes and each change (comment, card move, new column, ...)
            will add points to the users card on the Publish board. Users will also unlock achievements by creating
            enough events of specific event type.
          </li>
        </ol>

        <Player playsInline src="https://glowify.robibobi.com/static/video.webm" className="border">
          <BigPlayButton position="center" />
          <ControlBar autoHide={false}>
            <ForwardControl seconds={5} order={3.1} />
            <ForwardControl seconds={10} order={3.2} />
            <ForwardControl seconds={30} order={3.3} />
          </ControlBar>
        </Player>
      </>
    )
  }
}
