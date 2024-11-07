import axios from 'axios'
import {jwtDecode} from 'jwt-decode'


axios.interceptors.request.use(
    (config) => {
        const jwt = localStorage.getItem("jwtToken");

        if (jwt) {

            const decoded_jwt = jwtDecode(jwt);
            const current_time = Date.now() / 1000;

            if (decoded_jwt.exp < current_time) {
                //token is expired, remove it from localstorage
                localStorage.removeItem("jwtToken")
            
                
                window.location.href = "/"; //redirect to login page
            }
            else {
                config.headers.Authorization = `Bearer ${jwt}`;
            }
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default axios;


//this is a custom axios config
//this is needed to get the token from authorization header and add the jwt to every request that we do through axios.
//now we dont have to manually add the header in every request

//note --- now we will import axios from this file whenever axios is needed