import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import Header from './Header';
import Idcard from './Idcard';
import { auth, db, storage } from './firebase.js'
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import "./CheckApp.css";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import toast, { Toaster } from 'react-hot-toast';
import { ref, deleteObject } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

export default function DisplayUser() {
    const [currentUser, setCurrentUser] = useState("")
    const [userInfo, setUserInfo] = useState("")
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
        });


        // Cleanup function
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (currentUser && currentUser.uid) {
            getUser();
        }
    }, [currentUser]);

    const getUser = async () => {
        if (currentUser && currentUser.uid) {
            const docRef = await doc(db, currentUser.uid, phone);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
               
                setUserInfo(docSnap.data());
            } else {
                // docSnap.data() will be undefined in this case
                toast.error("No such document!");

            }
        }
        else {
            navigate("/")
        }

    }

    const deleteUser = async () => {
        if (currentUser && currentUser.uid) {
            const img = ref(storage, phone);
            deleteObject(img)
                .then(async () => {
                    await deleteDoc(doc(db, currentUser.uid, phone));
                    toast.success("Database Deleted")
                    await setTimeout(() => {
                        navigate("/viewall")
                    }, 2000)

                })
                .catch((error) => {
                    toast.error("Error deleting", error);
                });

        }
        else {
            navigate("/login")
        }
    }

    const editStatus = async () => {
        if (currentUser && currentUser.uid) {
            const statusRef = doc(db, currentUser.uid, phone);
            if (statusRef) {
                await updateDoc(statusRef, {
                    status: customerStatus
                })
                getUser()
                toast.success("Successfully updated");
                handleClose()
            }
            else {
                toast.error("Error when updating data")
            }

        }
        else {
            navigate("/")
        }

    }

    const { phone } = useParams();

    return (
        <div>
            <Header />
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
                    <Dropdown.Item><Link to="/viewall" className="nav-link"> <p>Go back to Records</p></Link></Dropdown.Item>
                    <Dropdown.Item><p className="delete-customer" onClick={async () => deleteUser()}>Delete this user</p></Dropdown.Item>
                    <Dropdown.Item><p className="delete-customer" onClick={handleShow}>Edit Customer Status</p></Dropdown.Item>
                </DropdownButton>
            </div>

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

        </div >
    )
}
