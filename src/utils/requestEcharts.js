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

// request interceptor
// service.interceptors.request.use(
//   config => {
//     // do something before request is sent

//     if (store.getters.token) {
//       // let each request carry token
//       // ['X-Token'] is a custom headers key
//       // please modify it according to the actual situation
//       config.headers['Authorization'] = getToken()
//     }
//     return config
//   },
//   error => {
//     console.log(error) // for debug
//     return Promise.reject(error)
//   }
// )

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    // console.log("=====Request返回结果======");
    // console.log(res);
    // console.log("=====Request返回结果======");
    return res
  },
  error => {
    console.log(error.response)
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    return Promise.reject(error)
  }
)
export default service
