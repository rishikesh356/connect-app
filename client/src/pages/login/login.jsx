import { Link, useNavigate } from "react-router-dom"
import "./login.scss"
import { useContext, useState } from "react"
import { AuthContext } from "../../context/authContext"

const Login = () => {
  const navigate=useNavigate()
  const [inputs, setinputs] = useState({
    username:"",
    password:"",
   
  })
  const handleChange=(e)=>{
    setinputs(prev=>({
      ...prev,//prev iss used so all fields except the current do not change
      [e.target.name]:e.target.value
    }))
}
  const [error, seterror] = useState(null)
  const {login}=useContext(AuthContext)
  const handleLogin=async(e)=>{
    e.preventDefault();
    try {
      await login(inputs);
      navigate("/")
    } catch (error) {
      seterror(error.response.data)
    }
    
  }
  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Hello World</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse maiores, ab quas laudantium tempore 
            ipsum ex aut voluptatum doloremque! Voluptatem quas blanditiis aspernatur esse eum sed nostrum ipsam 
            ab odio?</p>
           <span>
            Register Here
           </span>
           <Link to="/register" >
           <button>Register</button>
           </Link>
           
        </div>
        <div className="right">
          <h1>Login</h1>
          <form >
            <input type="text" placeholder="Username" name="username" onChange={handleChange}/>
            <input type="password" placeholder="passsword" name="password" onChange={handleChange}/>
            {error && error}
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login