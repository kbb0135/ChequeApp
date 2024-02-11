import React, { useEffect, useState } from 'react'
import Idcard from './Idcard.js';
import Header from './Header.js';
import "./CheckApp.css";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { auth, db, storage } from './firebase.js'
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import toast, { Toaster } from 'react-hot-toast';
import { ref, deleteObject } from 'firebase/storage';
import searchimg from './ImageContainer/search.svg'
import notfound from './ImageContainer/notfound.svg'
import { useNavigate } from 'react-router-dom';



export default function Home() {
    const [isSearch, setIsSearch] = useState(false);
    const [isSpinner, setIsSpinner] = useState(false);
    const [isStatus, setIsStatus] = useState();
    const [input, setInput] = useState("")
    const [userInfo, setUserInfo] = useState("")
    const [currentUser, setCurrentUser] = useState("")
    const [isNotUser, setIsNotUser] = useState(false)
    const [customerStatus, setCustomerStatus] = useState("")
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navigate = useNavigate();


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
        }, []);

        // Cleanup function
        return () => unsubscribe();
    }, []);

    const getStatus = async () => {
        const docRef = await doc(db, currentUser.uid, userInfo.phone);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
           
            setUserInfo(docSnap.data());
        } else {
            // docSnap.data() will be undefined in this case
            toast.error("No such document!");

        }
    }


    const deleteUser = async () => {
        if (currentUser.uid) {
            const img = ref(storage, userInfo.phone);
            deleteObject(img)
                .then(async () => {
                    await deleteDoc(doc(db, currentUser.uid, userInfo.phone));
                    toast.success("Database Deleted")
                    setIsSearch(false)
                    setIsStatus(false)
                    setInput("")

                })
                .catch((error) => {
                    toast.error("Error deleting", error);
                });

        }


    }

    const editStatus = async () => {

        const statusRef = doc(db, currentUser.uid, userInfo.phone);
        if (statusRef) {
            await updateDoc(statusRef, {
                status: customerStatus
            })
            getStatus()
            toast.success("Successfully updated");
            handleClose()
        }
        else {
            toast.error("Error when updating data")
        }

    }

    const SearchUser = async (e) => {
        e.preventDefault();
        if (input === "") {
            toast.error("Please enter valid number ")
            e.preventDefault();
        }
        else {
            setIsSpinner(true)
            setIsSearch(true)
            setIsNotUser(false)
            if (currentUser && currentUser.uid) {
                const docRef = await doc(db, currentUser.uid, input);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    
                    setUserInfo(docSnap.data());
                    setIsStatus(true)
                    setIsSpinner(false)


                    
                } else {
                    // docSnap.data() will be undefined in this case
            
                    setIsSpinner(false)
                    setIsStatus(false)
                    setIsNotUser(true)
                }
            }
            else {
                navigate("/")
            }


        }






    }
    const SetDefault = () => {
        setIsSearch(false)
        setIsStatus(false)
        setInput("")
    }

    return (
        <div>
            <Header />
            {
                isSearch ? (
                    <>
                        {
                            isStatus ? (
                                <>
                                    <div className="result-container">
                                        <div className="app-container">
                                            <div className="id-card-container">
                                                <Idcard
                                                    firstName={userInfo.firstName}
                                                    lastName={userInfo.lastName}
                                                    email={userInfo.email}
                                                    phone={userInfo.phone}
                                                    imageUrl={userInfo.image}
                                                    status={userInfo.status}
                                                />
                                            </div>
                                        </div>
                                        <DropdownButton id="dropdown-basic-button" title="Customer Options" variant="info">
                                            <Dropdown.Item><p className="delete-customer" onClick={async () => deleteUser()}>Delete this user</p></Dropdown.Item>
                                            <Dropdown.Item><p className="delete-customer" onClick={handleShow}>Edit Customer Status</p></Dropdown.Item>
                                            <Dropdown.Item><p onClick={() => SetDefault()}>Go back to Search</p></Dropdown.Item>
                                        </DropdownButton>

                                    </div>

                                </>
                            ) : (
                                <>
                                    {isNotUser ? (
                                        <>
                                            <div className="text-center mt-5">
                                                <h4>No Record for Customer found</h4>
                                                <p onClick={() => SetDefault()} className="p-container">Go back to Search</p>
                                                <img src={notfound} alt="img-notfound" className="img-search" />
                                            </div>
                                        </>
                                    ) : (
                                        <></>
                                    )}

                                </>
                            )
                        }

                    </>
                ) : (
                    <>
                        <h4 className="text-center mt-5">Looking for a customer??</h4>
                        <div className="text-center mt-5">
                            <input
                                type="text"
                                className="search"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter User Phone Number"
                            />


                        </div>
                        <div className="button-container">
                            <Button variant="success" onClick={async (e) => SearchUser(e)}>Search Customer</Button>
                        </div>
                        <img src={searchimg} alt="search" className="img-search" />
                    </>
                )
            }
            {
                isSpinner ? (
                    <>
                        <div className="result-container">

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

            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className="form-head">Category</Form.Label>
                        <Form.Select
                            aria-label="Default select example"
                            value={customerStatus}
                            onChange={(e) => setCustomerStatus(e.target.value)}
                        >
                            <option>Select Status</option>
                            <option value="Good Standing">Good Standing</option>
                            <option value="Bad Standing">Bad Standing</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={async () => editStatus()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Toaster />

        </div>
    )
}
