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
                Home
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
                <DropdownItem tag={RRNavLink} exact to="/ranks" activeClassName="active">
                  Ranks
                </DropdownItem>
                <DropdownItem tag={RRNavLink} exact to="/event-types" activeClassName="active">
                  Event Types
                </DropdownItem>
                <DropdownItem tag={RRNavLink} exact to="/achievements" activeClassName="active">
                  Achievements
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
            <NavItem>
              <a
                href="https://github.com/ronzyfonzy/glowify"
                target="_blank"
                aria-label="View source on GitHub"
                rel="noopener noreferrer"
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      '<svg width="25" height="40" class="octicon octicon-mark-github" viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>',
                  }}
                />
              </a>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    )
  }
}
