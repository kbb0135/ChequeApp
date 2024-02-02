import React, { useEffect, useState } from 'react'
import { auth, db } from './firebase.js';
import { collection, getDocs } from "firebase/firestore";
import UserContainer from './UserContainer.js';
import './userContainer.css'
import Header from './Header.js';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import notfound from './ImageContainer/notfound.svg'
import toast, {Toaster} from 'react-hot-toast';

const ViewAllCustomer = () => {
    const [currentUser, setCurrentUser] = useState("");
    const [userCollection, setUserCollection] = useState([]);
    const navigate = useNavigate("/")
    useEffect(() => {
        // Firebase Auth listener
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in.
                setCurrentUser(user);
                // Fetch data when component mounts
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
        if(currentUser && currentUser.uid) {
            try {
                const querySnapshot = await getDocs(collection(db, currentUser.uid));
                const userData = [];
                querySnapshot.forEach(doc => {
                    userData.push(doc.data());
                });
           // Check the data being fetched
                setUserCollection(userData);
            } catch (error) {
                toast.error("Error fetching user data:", error);
            }
        }
        else {
            navigate("/")
        }
        
    }

    return (
        <div>
            <Header />
            {
                userCollection.length <= 0 ? (
                    <>
                        <div className="text-center mt-5">
                            <h3 className="text-center mt-5">No Customer Record Exists!!</h3>
                            <Link to="/addcustomer" className="nav-link">      <Button variant="success">Add Customer</Button></Link>
                            <img  src={notfound} alt="img-notfound"  className="img-search"/>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <div className="menu-itemm">
                                {userCollection.map((item) => (
                                    <UserContainer
                                        key={item.id}
                                        item={item}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )
            }
        <Toaster />
        </div>
    )
}

export default ViewAllCustomer;
