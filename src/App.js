
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddCustomer from './AddCustomer';
import ViewAllCustomer from './ViewAllCustomer';
import DisplayUser from './DisplayUser';
import { useEffect, useState } from 'react';
import { auth } from './firebase';
import ForgetPassword from './ForgetPassword';

function App() {
  const [currentUser, setCurrentUser] = useState("")
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
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path ="/forgetpassword" element={<ForgetPassword/>} />



          {
            currentUser && currentUser.uid ? (
              <>
                <Route path="/home" element={<Home />} />
                <Route path="/addcustomer" element={<AddCustomer />} />
                <Route path="/viewall" element={<ViewAllCustomer />} />
                <Route path="/user/:phone" element={<DisplayUser />} />

              </>
            ) : (
              <>
                <Route path="/home" element={<Login />} />
                <Route path="/addcustomer" element={<Login />} />
                <Route path="/viewall" element={<Login />} />
                <Route path="/user/:phone" element={<Login />} />
              </>
            )
          }
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
