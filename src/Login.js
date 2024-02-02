import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase'
import { FaExclamationTriangle } from "react-icons/fa";
import "./login.css";
export default function Login () {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");


    const handleSubmit = async (e) => {

        e.preventDefault();
        const emailPattern = /^[\w.-]+@(gmail\.com|hotmail\.com|yahoo\.com|outlook\.com)$/i;

        if (email === "") {
            setLoginError("Please enter valid store id");
            e.preventDefault()
        }
        else {
            if (!emailPattern.test(email)) {
                setLoginError("Please enter valid store id");
                e.preventDefault();
            }
        }
        if (password.length <= 6) {
            setLoginError("Your password must be at least 8 characters long.")
            e.preventDefault();
        }
        if (emailPattern.test(email) && password.length >= 6) {
            try {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                    
                );
                const user = userCredential.user;
                
                if (user) {
                    navigate("/home")
                }
            }
            catch (error) {

                setLoginError(error.code)
            }
        }


    }
    return (
        <div className="login-main">


            <div className="auth-page">
                <div className={`auth-form  ${loginError && "box-invalid"}`}>
                    <span className="form-name">Log in to your account</span>
                    {loginError !== "" && (
                        <span className="te-invalid">
                            {" "}
                            <FaExclamationTriangle />
                            {loginError}
                        </span>
                    )}
                    <form>
                        <label htmlFor="email">Your Store:</label>
                        <input
                            type="email"
                            id="email"
                            className="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your Store ID"
                            required
                        />
                        

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            className="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            autoComplete="on"
                            required
                        />


                        <Button variant="info" onClick={(e) => handleSubmit(e)}>Submit</Button>
                    </form>

                    <div>
                        <Link to="/forgetpassword" className="forgetPassword">
                            Forgot Password?
                        </Link>
                    </div>

                </div>
            </div>

        </div>
    )
}
