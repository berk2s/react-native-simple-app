import axios from 'axios';

//constants
import { API_KEY, API_URL } from 'react-native-dotenv'

export default axios.create({
    baseURL: API_URL,
    headers:{
        'x-api-key': API_KEY
    }
});
