import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
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
    const [companyName, setCompanyName] = useState("")
    const [chequeImage, setChequeImage] = useState("")
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


            if (firstName === "") {
                setLoginError("Please enter valid name");
                e.preventDefault()
            }
            else if (lastName === "") {
                setLoginError("Please enter valid lastName");
                e.preventDefault()
            }
            else if (companyName === "") {
                setLoginError("Please enter valid company Name");
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
            else if (phone.length !== 10) {
                setLoginError("Please enter valid phoneNumber");
                e.preventDefault()
            }
            else if (image === "") {
                setLoginError("Please upload 1st image");
                e.preventDefault()
            }

            else if (chequeImage === "") {
                setLoginError("Please upload 2nd image");
                e.preventDefault()
            }

            else {
                if (currentUser.uid === null) {
                    alert("Cannot create customer")
                }
                else {
                    try {

                        const cName = `${'c'}${phone}`;
                        const docRef = doc(db, currentUser.uid, phone);
                        const docSnap = await getDoc(docRef);


                        if (!docSnap.exists()) {
                            setIsSpinner(true)
                            const storageRef = ref(storage, cName);

                            const uploadTask = uploadBytesResumable(storageRef, chequeImage);
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
                                async () => {
                                    getDownloadURL(uploadTask.snapshot.ref).then(
                                        async (downloadURLCheck) => {
                                            setIsSpinner(true)
                                            const storageRef1 = ref(storage, phone);
                                            const uploadTask1 = uploadBytesResumable(storageRef1, image);
                                            uploadTask1.on(
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

                                                    getDownloadURL(uploadTask1.snapshot.ref).then(
                                                        async (downloadURLID) => {
                                                            await setDoc(doc(db, currentUser.uid, phone), {
                                                                firstName: firstName,
                                                                lastName: lastName,
                                                                email: email,
                                                                companyName: companyName,
                                                                phone: phone,
                                                                date: Timestamp.now(),
                                                                image: downloadURLID,
                                                                chequeImage: downloadURLCheck,
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
                                        })
                                })

                        }
                        else {
                            e.preventDefault();
                            toast.error("Customer with number " + phone + " already exist")
                        }

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
                        <label htmlFor="password">Address(Optional):</label>
                        <input
                            type="text"
                            id="text"
                            className="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Address"
                            required
                        />

                        <label htmlFor="password">Company Name:</label>
                        <input
                            type="text"
                            id="text"
                            className="email"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Company Name"
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
                        <div className="chequeImage">
                            <label htmlFor="password">Upload Cheque Picture:</label>
                            <input
                                type="file"
                                accept="image/*"
                                capture="camera"
                                onChange={(e) => {
                                    // Handle image upload logic here
                                    setChequeImage(e.target.files[0]);
                                }}
                            />
                        </div>

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
