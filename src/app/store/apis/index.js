import axios from 'axios'
const instance = axios.create({baseURL: process.env.REACT_APP_API_ENDPOINT})

instance.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (error.response.status === 401) {
      if (error.config.url.startsWith('/admin')) {
        localStorage.removeItem('admin-user')
        localStorage.removeItem('admin-token')
        window.location.href = '/admin/auth'
      } else if (error.config.url.startsWith('/client')) {
        localStorage.setItem('ubox-is-authenticated', 0)
        localStorage.removeItem('ubox-user')
        localStorage.removeItem('client-token')
        window.location.href = '/client/login'
      } else {
        localStorage.setItem('ubox-is-authenticated', 0)
        localStorage.removeItem('ubox-user')
        localStorage.removeItem('client-token')
      }
    }
    return Promise.reject(error)
  }
)

// axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
// axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export default instance
