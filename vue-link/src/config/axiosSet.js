import axios from 'axios'

// axios.defaults.baseURL = 'http://localhost:8888/factory'; 
axios.defaults.baseURL = 'http://36.148.11.166:8888/factory';  // 云端
var instance = axios.create({});

instance.interceptors.request.use(config => {
    console.log('config', config)
    return config;
},err => {
    return Promise.reject(err);
});
// instance.interceptors.response.use(res => {
//     if(res.headers.token){
//         sessionStorage.setItem('token',res.headers.token);
//     }
//     return res;
// },err => {
//     return err;
// });

export default instance;