// IDCard.js
import React from 'react';
import './style.css'; // Import CSS file for styling
import Badge from 'react-bootstrap/Badge';

const Idcard = ({ firstName, lastName, phone, email, imageUrl, status }) => {
  return (
    <div className="id-card">
      <img src={imageUrl} alt="Profile Picture" className="profile-image" />
      <div className="text-container">
        <h2 className="name">First Name:  {firstName} </h2>
        <h2 className="name">Last Name:  {lastName}</h2>
        <h2 className="name">Email:  {email}</h2>
        <h2 className="name">Phone Number:  {phone}</h2>
        <h2 className="name"> Status: {
          status === "Good Standing" ? (
            <>
              <h4><Badge bg="success">{status}</Badge></h4>
            </>
          ) : (
            <>
              <div className="form-content">
                <h4><Badge bg="danger">{status}</Badge></h4>
              </div>
            </>
          )
        }</h2>
      </div>
    </div>
  );
}

export default Idcard;
