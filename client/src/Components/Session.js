class Session {
  constructor() {
    this.session = window.sessionStorage.getItem('account')
    if (this.session) {
      try {
        this.session = JSON.parse(this.session)
      } catch (error) {
        window.sessionStorage.removeItem('account')
        this.session = null
      }
    }

    this.isAuthenticated = this.session ? true : false
  }

  async callFetch(endpoint, method, body) {
    return await fetch(`${process.env.REACT_APP_CLIENT_SERVER_URL}/${endpoint}`, {
      method: method || 'GET',
      credentials: 'include',
      body: body ? JSON.stringify(body) : null,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        return response.json()
      })
      .catch(error => console.error(error))
  }

  async login(username, password) {
    return await this.callFetch('login', 'POST', { username, password }).then(response => {
      if (response.id !== undefined) {
        window.sessionStorage.setItem('account', JSON.stringify(response))
        this.session = response
        this.isAuthenticated = true
      }

      return response
    })
  }

  async signout() {
    await this.callFetch('logout').then(() => {
      this.removeSession()
    })
  }

  removeSession() {
    window.sessionStorage.removeItem('account')
    this.session = null
    this.isAuthenticated = false
  }

  async signup(username, email, password) {
    await this.callFetch('signup', 'POST', { username, email, password })
  }

  async savePreferences(gloApiKey) {
    await this.callFetch('user-preferences', 'PUT', { gloApiKey })
  }
}

export default new Session()
