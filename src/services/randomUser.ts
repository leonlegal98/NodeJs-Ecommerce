import axios from "axios"
import { User } from "../interfaces/InterfaceUser"

const url = 'https://randomuser.me/api/';

class RandomUser {

    static async getOne() {

        const result =  await axios.get(url);
        const user = result.data.results[0] as User;

        return user


    }

}

export default RandomUser;