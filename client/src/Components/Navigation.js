import React, { Component } from 'react'
import { NavLink as RRNavLink } from 'react-router-dom'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import Session from './Session'

export default class Navigation extends Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: false,
    }
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }

  render() {
    const { history } = this.props
    return (
      <Navbar color="light" light expand="md" className="mb-3">
        <NavbarBrand tag={RRNavLink} exact to="/home">
          Glowify{' '}
          <span role="img" aria-label="gold medal">
            🥇
          </span>
          <span role="img" aria-label="squid">
            🦑
          </span>
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink tag={RRNavLink} exact to="/home" activeClassName="active">
                Info
              </NavLink>
            </NavItem>
            <NavItem className={Session.isAuthenticated ? '' : 'd-none'}>
              <NavLink tag={RRNavLink} exact to="/glowifys" activeClassName="active">
                Glowifys
              </NavLink>
            </NavItem>
            <NavItem hidden={true} className={Session.isAuthenticated ? '' : 'd-none'}>
              <NavLink tag={RRNavLink} exact to="/glowify-add" activeClassName="active">
                Add glowify
              </NavLink>
            </NavItem>
            <NavItem className={Session.isAuthenticated ? 'd-none' : ''}>
              <NavLink tag={RRNavLink} exact to="/signup" activeClassName="active">
                Signup
              </NavLink>
            </NavItem>
            <NavItem className={Session.isAuthenticated ? 'd-none' : ''}>
              <NavLink tag={RRNavLink} exact to="/login" activeClassName="active">
                Login
              </NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar className={Session.isAuthenticated ? '' : 'd-none'}>
              <DropdownToggle nav caret>
                Gamification
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem tag={RRNavLink} exact to="/event-types" activeClassName="active">
                  Event Types
                </DropdownItem>
                <DropdownItem tag={RRNavLink} exact to="/achievements" activeClassName="active">
                  Achievements
                </DropdownItem>
                <DropdownItem tag={RRNavLink} exact to="/ranks" activeClassName="active">
                  Ranks
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown nav inNavbar className={Session.isAuthenticated ? '' : 'd-none'}>
              <DropdownToggle nav caret>
                {`Welcome ${Session.isAuthenticated ? Session.session.username : ''}`}
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem
                  onClick={() => {
                    history.push('/user')
                  }}
                >
                  Preferences
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    Session.signout().then(() => history.push('/login'))
                  }}
                >
                  Sign out
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    )
  }
}
