import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8080/dyemanager'; 

var instance = axios.create({});

// instance.interceptors.request.use(config => {
//     let AUTH_TOKEN = sessionStorage.getItem("token");
//     if(AUTH_TOKEN){
//         if (config.url.includes("/admin/login") ) {
            
//         }else {
//             config.headers.common["Authorization"] = AUTH_TOKEN;
//         }
//     }
//     return config;
// },err => {
//     return Promise.reject(err);
// });
// instance.interceptors.response.use(res => {
//     if(res.headers.token){
//         sessionStorage.setItem('token',res.headers.token);
//     }
//     return res;
// },err => {
//     return err;
// });

export default instance;