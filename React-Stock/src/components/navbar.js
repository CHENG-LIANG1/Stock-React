import React from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
function Nav() {
  const navStyle = {
    color: "white",
    textDecoration: "none"
  };

  const history = useHistory();

  const routeChange = () =>{ 
    let path = `./login`; 
    history.push(path);
  }
  const routeChange2 = () =>{ 
    let path = `./register`; 
    history.push(path);
  }
  let token = localStorage.getItem("token");
  function logout(){
    localStorage.removeItem("token");
  }

  function Login(){
    if(token != null){
        return(<div className="nav-buttons">  <Button onClick={e => {logout()
        history.push("/");
        }} variant="contained" color="secondary">Logout</Button> </div>)
    }
     else return (
  
        <div className="nav-buttons">
        <Button variant="contained" color="secondary" size="large" onClick={routeChange2}>
          Register
        </Button>
        &nbsp;&nbsp;
        <Button variant="contained" color="secondary" size="large" onClick={routeChange}> 
          Login
        </Button>
      </div>)

}



  return (
    <nav>
      <ul className="nav-links">
        <Link to="/" style={navStyle}>
          <li>Home</li>
        </Link>
        <Link to="Stocks" style={navStyle}>
          <li>Stocks</li>
        </Link>
        <Link to="Quote" style={navStyle}>
          <li>Quote</li>
        </Link>
      </ul>
      <Login />

    </nav>
  );
}

export default Nav;
