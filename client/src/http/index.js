import Axios from 'axios'

Axios.defaults.baseURL = process.env.VUE_APP_APIURL;


export default Axios