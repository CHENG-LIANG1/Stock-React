import React from "react";
import { Button } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import image from "./register.png";
import {useState} from "react";
import { useHistory } from "react-router-dom";


function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registered, setRegistered] = useState(false);
    const API_URL =`http://131.181.190.87:3000`;
    const history = useHistory();

    // register a user in to the dateabase
    function registerUser(email, password){
        const url =`${API_URL}/user/register`;
        return fetch(url,{
            method: "POST",
            headers:{accept:"application/json", "Content-Type": "application/json"},
            body: JSON.stringify({email:email, password:password})
        }).then(res => {
            if(res.status === 409){
                setRegistered(true);
                alert("This account has been created, please log in!");
            }
            else if(res.status === 400){
                if(email === "" && password ===  ""){
                    throw new Error ("Missing E-mail and passward!");
                }else if (email !== "" && password ===  ""){
                    throw new Error ("Missing passward!");
                    
                }else if(email === "" && password !==  ""){
                    throw new Error ("Missing E-mail!");
                }
                    setRegistered(false);
                }else{
                    setRegistered(true);
                }})
                .catch(error => {
                    setRegistered(false);
                    alert(error);
                })}
    
    // conditionally display login and register button
    function Login(){
        if(registered === true){
            return(<div>  <Button onClick={e => history.push("./login")}variant="contained" color="primary">Login</Button> </div>)
        }
        return (<div>  <Button  onClick={e => {
            registerUser(email, password);
               }} variant="contained" color="primary">Register </Button></div>)

    }
    

    return(
    
    <div className="register-page">
        <img src={image} alt="register"/>

        <div className="form">
            <label htmlFor="email">Email</label>&nbsp;&nbsp;
            <Input type="email" name="email" placeholder="Email"
                         onChange={(e) => {
                            setEmail(e.target.value);}}/> 
        </div>
        
        <div className="form">
            <label htmlFor="uername">Password</label>&nbsp;&nbsp;
            <Input type="text" name="password" placeholder="password"
                         onChange={(e) => {
                            setPassword(e.target.value);}}/> 
        </div>

        <div className="login-button">
        <Login />
        </div>
    </div>)
}

export default Register;