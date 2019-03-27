import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import {
  Input,
  Form,
  FormGroup,
  Label,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'
import Session from './Session'

export default class AddGlowify extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirectToReferrer: false,
      isDataLoaded: false,
      modal: false,
      alert: null,
      boards: [],
      listenBoard: '',
      publishBoard: '',
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_CLIENT_SERVER_URL}/glo-boards`, {
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
        } else if (response.status === 503) {
          this.setState({
            isDataLoaded: true,
            alert: "Can't get Boards form Glo API. Please check you GloApiKey under user preferences.",
          })
        } else {
          throw new Error(response.json())
        }
      })
      .then(response => {
        this.setState({
          boards: [{ id: 0, name: '-- Select board --' }, ...response.data],
          isDataLoaded: true,
        })
      })
      .catch(error => {
        console.error(error)
      })
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }))
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value,
      alert: null,
    })
  }

  add = () => {
    this.setState({
      modal: false,
    })
    if (this.state.listenBoard === this.state.publishBoard) {
      this.setState({
        alert: 'You have to select two diffferent boards',
      })
      return
    }

    const listenBoard = this.state.boards.filter(b => b.id === this.state.listenBoard).pop()
    const publishBoard = this.state.boards.filter(b => b.id === this.state.publishBoard).pop()

    this.setState({
      isDataLoaded: false,
    })

    fetch(`${process.env.REACT_APP_CLIENT_SERVER_URL}/glowify`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        listenBoard,
        publishBoard,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.status === 200 || response.status === 400) {
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
        if (response.error) {
          this.setState({
            isDataLoaded: true,
            alert: response.error,
          })
        } else {
          this.setState({ redirectToReferrer: '/glowifys' })
        }
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
        <Row>
          <Col>
            <Spinner color="primary" className={this.state.isDataLoaded ? 'd-none' : ''} />
            <Form className={this.state.isDataLoaded ? 'pb-3' : 'd-none'}>
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="listenBoard">Listen Board</Label>
                    <Input type="select" name="listenBoard" onChange={this.handleInputChange}>
                      {this.state.boards.map(board => (
                        <option key={board.id} value={board.id}>
                          {board.name}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="publishBoard">Publish Board</Label>
                    <Input type="select" name="publishBoard" onChange={this.handleInputChange}>
                      {this.state.boards.map(board => (
                        <option key={board.id} value={board.id}>
                          {board.name}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <Button color="danger" tag={Link} to="/glowifys" onClick={this.toggle}>
                Cancel
              </Button>
              <Button color="primary" className="float-right" onClick={this.toggle}>
                Add
              </Button>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Alert color="danger" className={this.state.alert ? '' : 'd-none'}>
              {this.state.alert}
            </Alert>
          </Col>
        </Row>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Destructive Action</ModalHeader>
          <ModalBody>By glowifying the selected Publish Board you will delete all data in that board</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.add}>
              OK. Let's do this{' '}
              <span role="img" aria-label="flexed biceps">
                💪
              </span>
            </Button>{' '}
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }
}
