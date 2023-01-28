import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
// import store from '@/store'
// import { getToken,removeToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: window.location.protocol + "//" + window.location.hostname+":8095/api/", // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  baseURL: 'http://39.96.60.245:8095/api/',//process.env.baseURL,
  timeout: 10000 // request timeout
})


// response interceptor
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    return Promise.reject(error)
  }
)
export default service
