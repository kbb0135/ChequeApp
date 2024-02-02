import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import { doc, setDoc, Timestamp } from "firebase/firestore";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import {useNavigate } from 'react-router-dom';
import { auth, db, storage } from './firebase'
import { FaExclamationTriangle } from "react-icons/fa";
import './addCustomer.css'
import Header from './Header';
import Spinner from 'react-bootstrap/Spinner';
import toast, { Toaster } from 'react-hot-toast';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';

export default function AddCustomer() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    // const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [image, setImage] = useState("")
    const [loginError, setLoginError] = useState("");
    const [currentUser, setCurrentUser] = useState("");
    const [isSpinner, setIsSpinner] = useState(false)
    const [progress, setProgress] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        // Firebase Auth listener
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in.
                setCurrentUser(user);
            } else {
                // User is signed out.
                setCurrentUser(null);
            }
        });

        // Cleanup function
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        if (currentUser && currentUser.uid) {
            e.preventDefault();
            const emailPattern = /^[\w.-]+@(gmail\.com|hotmail\.com|yahoo\.com|outlook\.com)$/i;

            if (firstName === "") {
                setLoginError("Please enter valid name");
                e.preventDefault()
            }
            else if (lastName === "") {
                setLoginError("Please enter valid lastName");
                e.preventDefault()
            }
            // else if (email === "") {
            //     setLoginError("Please enter valid email");
            //     e.preventDefault()
            // }
            // else if (!emailPattern.test(email)) {
            //     setLoginError("Please enter valid email");
            //     e.preventDefault();
            // }
            else if (phone.length != 10) {
                setLoginError("Please enter valid phoneNumber");
                e.preventDefault()
            }
            else if (image === "") {
                setLoginError("Please upload image");
                e.preventDefault()
            }
            else if (image.name === "") {
                setLoginError("Please upload image with valid name");
                e.preventDefault()
            }
            else {
                if (currentUser.uid === null) {
                    alert("Cannot create customer")
                }
                else {
                    try {
                        setIsSpinner(true)
                        const storageRef = ref(storage, phone);
                        const uploadTask = uploadBytesResumable(storageRef, image);
                        uploadTask.on(
                            "state_changed",
                            (snapshot) => {
                                // Observe state change events such as progress, pause, and resume
                                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                                const progressState = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                setProgress(progressState)
                                switch (snapshot.state) {
                                    case "paused":
                                        toast.error("Upload is paused");
                                        break;
                                    case "running":
                                        // toast.success("Upload is running");
                                        break;
                                    default:
                                        toast.error("Something went wrong");
                                }
                            },
                            (error) => {
                                // Handle unsuccessful uploads
                                toast.error(error.message);
                            },
                            () => {
                                getDownloadURL(uploadTask.snapshot.ref).then(
                                    async (downloadURL) => {
                                        await setDoc(doc(db, currentUser.uid, phone), {
                                            firstName: firstName,
                                            lastName: lastName,
                                            email: email,
                                            phone: phone,
                                            date: Timestamp.now(),
                                            image: downloadURL,
                                            status: "Good Standing"
                                        });
                                        setIsSpinner(false)
                                        toast.success("Customer created")
                                        setFirstName("")
                                        setLastName("")
                                        setEmail("")
                                        setPhone("")
                                        setImage("")
                                        navigate("/viewall")
                                    })
                            })



                    } catch (e) {
                       toast.error("Error adding document: ", e);
                    }
                }

            }
        }
        else {
            navigate("/")
        }


    }
    return (
        <div className>
            <Header />
            <div className="customer-page">
                <div className={`customer-form  ${loginError && "box-invalid"}`}>
                    <span className="form-name">Add Customer</span>
                    {loginError !== "" && (
                        <span className="te-invalid">
                            {" "}
                            <FaExclamationTriangle />
                            {loginError}
                        </span>
                    )}
                    <form>
                        <label htmlFor="email">First Name:</label>
                        <input
                            type="text"
                            id="text"
                            className="email"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter Name"
                            required
                        />


                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            type="text"
                            id="text"
                            className="email"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter Last Name"
                            required
                        />
                        <label htmlFor="password">Email(Optional):</label>
                        <input
                            type="text"
                            id="text"
                            className="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                            required
                        />
                        <label htmlFor="password">Phone Number:</label>
                        <input
                            type="text"
                            id="text"
                            className="email"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter phone Number"
                            required
                        />
                        <label htmlFor="password">Upload Customer Picture:</label>
                        <input
                            type="file"
                            accept="image/*"
                            capture="camera"
                            onChange={(e) => {
                                // Handle image upload logic here
                                setImage(e.target.files[0]);
                            }}
                        />
                        <Button variant="info" onClick={(e) => handleSubmit(e)}>Submit</Button>
                        {
                            isSpinner ? (
                                <>
                                    <div className="spinner">
                                        <ProgressBar variant="success" now={progress} />
                                    </div>
                                    <div className="spinner">


                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    </div>
                                </>
                            ) : (
                                <>
                                </>
                            )
                        }
                    </form>
                </div>
            </div>
            <Toaster />

        </div>
    )
}
