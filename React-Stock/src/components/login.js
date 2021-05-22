import React from "react";
import { Button } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import image from "./login.png";
import {useState} from "react";
import { useHistory } from "react-router-dom";




function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const API_URL =`http://131.181.190.87:3000`;
    const history = useHistory();


    // generate a token when user provides valid email and password
    function getUserToken(email, password){
        const url =`${API_URL}/user/login`;
        return fetch(url,{
            method: "POST",
            headers:{accept:"application/json", "Content-Type": "application/json"},
            body: JSON.stringify({email:email, password:password})
        })
          .then(res => 
            {// handle different error conditions
            if(res.status === 401){
                setError(true);
                localStorage.removeItem("token");
                if(email === "" && password ===  ""){
                    setError(true)
                    throw new Error("Missing E-mail and passward!");
                } 
                if (email !== "" && password ===  ""){
                    setError(true);
                    throw new Error("Missing passward!");
                }
                 if(email === "" && password !==  ""){
                    setError(true);
                    throw new Error("Missing E-mail!");
                }
                
                if(email !== "" && password !==  ""){
                    setError(true)
                    throw new Error("Invalid E-mail or passward! Please register first!");
                 }}
            else{
                    setError(false);
                    return res.json()}
                }
           )
          .then(res => {
              localStorage.setItem("token", res.token)})
          .catch(error => {
              alert(error); // inform user of the errors
          })

    
    }

    // conditionally display success button, only when the user is logged in successfully
    function Login(){
        if(error === false){
            return(<div className="login-button">  <Button onClick={e =>  history.push("/Stocks")}variant="contained" color="primary">Success</Button> </div>)
        }
        return (        
            <div className="login-button">
                <Button onClick={e => {
                    getUserToken(email, password);
                   }} variant="contained" color="primary">Login</Button> 
    
            </div>
    )

    }
    
    return(
    
    <div className = "login-page">
        <img src={image} alt="login"/>
         <div className="form">
            <label htmlFor="email">Email</label>&nbsp;&nbsp;
            <Input type="email" name="email" placeholder="Email"
                    onChange={(e) => {
                        setEmail(e.target.value);}}
            /> 
        </div>

        <div className="form">
            <label htmlFor="uername">Password</label>&nbsp;&nbsp;
            <Input type="text" name="password" placeholder="password"
                         onChange={(e) => {
                            setPassword(e.target.value);}}/> 
        </div>


        <Login />
 
 

    </div>)
}

export default Login;