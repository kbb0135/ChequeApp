import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function Header() {
    const [currentUser, setCurrentUser] = useState("")
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

    const handleLogOut = async () => {
        signOut(auth)
            .then(() => {
                toast.success("User logged out.");
                navigate('/')
            })
            .catch((error) => {
                toast.error("There is an error logging out.");
            });
    };
    return (
        <div>

            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand>Cheque App</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        {
                            currentUser && currentUser.email ? (
                                <>
                                    <Nav className="me-auto">

                                        <Nav.Link><Link to="/home" className="nav-link">Search</Link></Nav.Link>
                                        <Nav.Link><Link to="/addcustomer" className="nav-link">Add Customer</Link></Nav.Link>
                                        <Nav.Link ><Link to="/viewall" className="nav-link">View All Customer</Link></Nav.Link>

                                    </Nav>
                                    <Nav>

                                        <DropdownButton id="dropdown-basic-button" title={`Hello ${currentUser.email}`} variant="info">
                                            {/* <Dropdown.Item ><Link to="/changepassword" className="header-link">Change Password</Link></Dropdown.Item> */}
                                            <Dropdown.Item onClick={async () => handleLogOut()}>Log Out</Dropdown.Item>
                                        </DropdownButton>
                                    </Nav>
                                </>

                            ) : (
                                <>
                                </>
                            )
                        }

                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Toaster />
        </div>
        
    )

}
