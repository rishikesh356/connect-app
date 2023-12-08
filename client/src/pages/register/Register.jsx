import { Link } from "react-router-dom"
import "./register.scss"
import { useState } from "react"
import axios from "axios"
const Register = () => {
  const [inputs, setinputs] = useState({
    username:"",
    email:"",
    password:"",
    name:"",
  })
  const [error, seterror] = useState(null)
  const handleChange=(e)=>{
      setinputs(prev=>({
        ...prev,//prev iss used so all fields except the current do not change
        [e.target.name]:e.target.value
      }))
  }
  const handleOnClick= async(e)=>{
      e.preventDefault();
      try {
        await  axios.post("http://localhost:8800/api/auth/register",inputs)
      } catch (err) {
        seterror(err.response.data);
      }
  }
  console.log(error)
  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Hello World</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse maiores, ab quas laudantium tempore 
            ipsum ex aut voluptatum doloremque! Voluptatem quas blanditiis aspernatur esse eum sed nostrum ipsam 
            ab odio?</p>
           <span>
            Do you have an account
           </span>
           <Link to="/login">
           <button>Login</button>
           </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form >
            <input type="text" placeholder="Username" name="username" onChange={handleChange} />
            <input type="email" placeholder="Email" name="email" onChange={handleChange}/>
            <input type="password" placeholder="passsword" name="password" onChange={handleChange}/>
            <input type="text" placeholder="Name" name="name" onChange={handleChange}/>
            {error &&  error}
            <button onClick={handleOnClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register