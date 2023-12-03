import { Link } from "react-router-dom"
import "./register.scss"

const Register = () => {
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
            <input type="text" placeholder="Username" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="passsword" />
            <input type="text" placeholder="Name" />
            <button>Register</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register