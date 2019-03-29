import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
export default class Footer extends Component {
  render() {
    return (
      <div className="footer bg-light p-3 mt-3">
        <Container>
          <Row>
            <Col className="text-center">
              <p className="social">
                <iframe
                  src="https://ghbtns.com/github-btn.html?user=ronzyfonzy&amp;repo=glowify&amp;type=star&amp;count=true"
                  title="stars"
                  frameBorder="0"
                  scrolling="0"
                  width="100"
                  height="20px"
                />
                <iframe
                  src="https://ghbtns.com/github-btn.html?user=ronzyfonzy&amp;repo=glowify&amp;type=fork&amp;count=true"
                  title="forks"
                  frameBorder="0"
                  scrolling="0"
                  width="100"
                  height="20px"
                />
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
