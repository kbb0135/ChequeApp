import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';

const UserContainer = ({ item }) => {
    return (
        <div classNmae="main-container">
            <div className="menu-card">
                <Link to={`/user/${item.phone}`} className="link">
                    <img src={item.image} alt={item.image} className="food-img" />
                    <div className="menu-card-content">
                        <span>Name:    <b>{item.firstName}</b></span>
                        <span>Phone Number:  <b>{item.phone}</b></span>
                        <span> Status: {
                            item.status === "Good Standing" ? (
                                <>
                                    <h4><Badge bg="success">{item.status}</Badge></h4>
                                </>
                            ) : (
                                <>
                                    <div className="form-content">
                                        <h4><Badge bg="danger">{item.status}</Badge></h4>
                                    </div>
                                </>
                            )
                        }</span>
                        <div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default UserContainer;

