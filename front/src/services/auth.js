import axios from "axios";

export async function registerUser(nickname, password){
    const response = await axios.post("http://localhost:5044/API/users", {
        "nickname":nickname,
        "password":password
      })
      console.log(response.data)
}