import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [emailId, setEmailId] = useState('');
    const [address, setAddress] = useState('');
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const fetchUsers = async () => {
        const response = await fetch('http://localhost:5000/users');
        const data = await response.json();
        setUsers(data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const addUser = async (userData) => {
        try {
            const response = await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('User added:', result);
            resetForm();
            fetchUsers();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (!firstName || !lastName || !phoneNumber || !emailId || !address) {
            alert('All fields are required!');
            return;
        }
    
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailId)) {
            alert('Please enter a valid email address.');
            return;
        }
    
        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(phoneNumber)) {
            alert('Please enter a valid 10-digit phone number.');
            return;
        }
    
        // Check if email or phone number already exists
        const emailExists = users.some(user => user.email === emailId);
        const phoneExists = users.some(user => user.phone === phoneNumber);
    
        if (emailExists) {
            alert('Email is already in use. Please enter a different email.');
            return;
        }
    
        if (phoneExists) {
            alert('Phone number is already in use. Please enter a different phone number.');
            return;
        }
    
        const userData = {
            first_name: firstName,
            last_name: lastName,
            phone: phoneNumber,
            email: emailId,
            address: address,
        };
    
        if (currentUser) {
            updateUser(currentUser.id, userData);
        } else {
            addUser(userData);
        }
    };

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setEmailId('');
        setAddress('');
        setCurrentUser(null);
    };

    const updateUser = async (userId, userData) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('User updated:', result);
            resetForm();
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const deleteUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEdit = (user) => {
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setPhoneNumber(user.phone);
        setEmailId(user.email);
        setAddress(user.address);
        setCurrentUser(user);
    };

    return (
        <div>
            <h1>Add User</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email ID"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
                <button type="submit">{currentUser ? 'Update User' : 'Add User'}</button>
            </form>

            <h2>User List</h2>
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.address}</td>
                            <td className="user-actions">
                                <button className="edit-button" onClick={() => handleEdit(user)}>Edit</button>
                                <button className="delete-button" onClick={() => deleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default App;
