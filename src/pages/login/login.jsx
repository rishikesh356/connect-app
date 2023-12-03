import { Link } from "react-router-dom"
import "./login.scss"
import { useContext } from "react"
import { AuthContext } from "../../context/authContext"

const Login = () => {
  const {login}=useContext(AuthContext)
  const handleLogin=()=>{
    login();
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
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="passsword" />
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login