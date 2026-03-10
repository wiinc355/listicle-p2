const form = document.getElementById('login-form')
const message = document.getElementById('login-message')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const username = document.getElementById('username').value.trim()
  const password = document.getElementById('password').value.trim()

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })

    const data = await response.json()

    if (!response.ok) {
      message.textContent = data.message || 'Login failed'
      return
    }

    window.location.href = '/'
  } catch (error) {
    console.error(error)
    message.textContent = 'Unable to login right now.'
  }
})