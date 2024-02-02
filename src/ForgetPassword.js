import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase'
import { FaExclamationTriangle } from "react-icons/fa";
import "./login.css";

export default function ForgetPassword() {
    const [email, setEmail] = useState("")
    const [loginError, setLoginError] = useState("");

    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailPattern = /^[\w.-]+@(gmail\.com|hotmail\.com|yahoo\.com|outlook\.com)$/i;

        if (email === "") {
            setLoginError("Please enter valid store id");
            e.preventDefault()
        }

        else if (!emailPattern.test(email)) {
            setLoginError("Please enter valid store id");
            e.preventDefault();
        }

        
        else {
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    setLoginError("Password Reset email sent to " + email + " if it exists")
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    setLoginError(errorMessage)
                    // ..
                });
            setLoginError("")
            setEmail("")
            setTimeout(() => {
                navigate("/")
            }, 3000);


        }
    }
    return (
        <div className="login-main">


            <div className="auth-page">
                <div className={`auth-form  ${loginError && "box-invalid"}`}>
                    <span className="form-name">Reset Password</span>
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
                        <Button variant="info" onClick={(e) => handleSubmit(e)}>Reset Password</Button>
                    </form>

                </div>
            </div>

        </div>
    )
}
