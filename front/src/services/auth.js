import axios from "axios";

export async function registerUser(username, password){
  try {
    const response = await axios.post("http://localhost:5044/API/users", {
        username, password
    }, {withCredentials: true,})
    return {
      message:response.data.message,
      success:true
    }
  } catch (error) {
    return {
      message:error.response.data.message,
      success:false
    }
  }

}

export async function login(username, password){
  try {
    const response = await axios.post("http://localhost:5044/API/login", {
        username, password
    }, {withCredentials: true,})
    return {
      message:response.data.message,
      success:true
    }
  } catch (error) {
    return {
      message:error.response.data.message,
      success:false
    }
  }
}

export async function logout(navigate) {
  try {
    await axios.post("http://localhost:5044/api/logout", {}, { withCredentials: true });

    navigate("/");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
}

export async function checkAuth() {
  try {
    await axios.get("http://localhost:5044/api/check", {
      withCredentials: true,
    });
    return true;
  } catch {
    return false;
  }
}
