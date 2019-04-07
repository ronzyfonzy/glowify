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
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap'
import Session from './Session'

const glowStyle = {
  textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #228dff, 0 0 35px #228dff, 0 0 40px #228dff',
}

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
      selectedListenBoard: '',
      selectedPublishBoard: '',
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.checkSelectedData = this.checkSelectedData.bind(this)
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_CLIENT_API_URL}/glo-boards`, {
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
          boards: response.data,
          isDataLoaded: true,
        })
      })
      .catch(error => {
        console.error(error)
      })
  }

  toggleModal() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }))
  }

  checkSelectedData() {
    const listenBoard = this.state.boards.find(b => b.id === this.state.listenBoard)
    const publishBoard = this.state.boards.find(b => b.id === this.state.publishBoard)

    if (!listenBoard) {
      this.setState({
        alert: 'You have to select a listen board',
      })
      return
    }

    if (this.state.listenBoard === this.state.publishBoard) {
      this.setState({
        alert: 'You have to select two diffferent boards OR let Glowify create a publish board',
      })
      return
    }

    this.setState({
      selectedListenBoard: listenBoard,
      selectedPublishBoard: publishBoard,
    })

    this.toggleModal()
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

    const listenBoard = this.state.boards.find(b => b.id === this.state.listenBoard)
    const publishBoard = this.state.boards.find(b => b.id === this.state.publishBoard)

    this.setState({
      isDataLoaded: false,
    })

    fetch(`${process.env.REACT_APP_CLIENT_API_URL}/glowify`, {
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
        <Breadcrumb>
          <BreadcrumbItem>Glowifys</BreadcrumbItem>
          <BreadcrumbItem active>Add Glowify</BreadcrumbItem>
        </Breadcrumb>
        <div className="text-center" hidden={this.state.isDataLoaded}>
          <Spinner color="primary" />
          <p style={glowStyle} className="mt-4" hidden={this.state.selectedListenBoard === ''}>
            Ow yeah{' '}
            <span role="img" aria-label="hands raised">
              🙌
            </span>{' '}
            ... <span>Glowifying</span> your <b>{this.state.selectedListenBoard.name}</b> board
          </p>
        </div>
        <Form hidden={!this.state.isDataLoaded}>
          <Row>
            <Col>
              <FormGroup>
                <Label for="listenBoard">Listen Board</Label>
                <Input type="select" name="listenBoard" onChange={this.handleInputChange}>
                  {[{ id: 0, name: '-- Select board --' }, ...this.state.boards].map(board => (
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
                  {[{ id: -1, name: '-- Create Glowify Board --' }, ...this.state.boards].map(board => (
                    <option key={board.id} value={board.id}>
                      {board.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Button color="danger" tag={Link} to="/glowifys">
            Cancel
          </Button>
          <Button color="primary" className="float-right" onClick={this.checkSelectedData}>
            Add
          </Button>
        </Form>
        <Alert className="mt-3" color="danger" hidden={!this.state.alert}>
          {this.state.alert}
        </Alert>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            <span role="img" aria-label="warning" hidden={!this.state.selectedPublishBoard}>
              ⚠️
            </span>{' '}
            Confirmation
          </ModalHeader>
          <ModalBody>
            {this.state.selectedPublishBoard ? (
              <div>
                Glowify will configure <b>{this.state.selectedListenBoard.name}</b> where ranks and achievements will
                appear for changes in <b>{this.state.selectedPublishBoard.name}</b>.
                <br />
                <br />
                By glowifying <b>{this.state.selectedPublishBoard.name}</b> you will delete all data in that board.
              </div>
            ) : (
              <div>
                Glowify will create a <b>new board</b> where ranks and achievements will appear for changes in{' '}
                <b>{this.state.selectedListenBoard.name}</b>.
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color={this.state.selectedPublishBoard ? 'danger' : 'success'} onClick={this.add}>
              OK. Let's do this{' '}
              <span role="img" aria-label="flexed biceps">
                💪
              </span>
            </Button>{' '}
            <Button color="secondary" onClick={this.toggleModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }
}
