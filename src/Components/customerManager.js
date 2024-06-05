import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Row, Col, Container } from 'react-bootstrap';

const CustomerManager = () => {
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        city: '',
        balance: 0
    });
    const [isEditing, setIsEditing] = useState(false);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:8889/api/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:8889/api/profile/${formData.username}`, formData);
                setIsEditing(false);
            } else {
                await axios.post('http://localhost:8889/api/register', formData);
            }
            setFormData({
                id: '',
                username: '',
                password: '',
                firstName: '',
                lastName: '',
                city: '',
                balance: 0
            });
            fetchCustomers();
        } catch (error) {
            console.error('Error saving customer:', error);
        }
    };

    const handleEdit = (customer) => {
        setFormData(customer);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8889/api/delete/${id}`);
            fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    return (
        <Container>
            <h2 className="mt-4">{isEditing ? 'Edit Customer' : 'Add Customer'}</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="formFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="formLastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="formCity">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="formBalance">
                            <Form.Label>Balance</Form.Label>
                            <Form.Control
                                type="number"
                                name="balance"
                                value={formData.balance}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" type="submit">
                    {isEditing ? 'Save Changes' : 'Add Customer'}
                </Button>
                {isEditing && (
                    <Button variant="secondary" className="ms-2" onClick={() => setIsEditing(false)}>
                        Cancel
                    </Button>
                )}
            </Form>

            <h2 className="mt-4">Customer List</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>City</th>
                        <th>Balance</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.username}</td>
                            <td>{customer.firstName}</td>
                            <td>{customer.lastName}</td>
                            <td>{customer.city}</td>
                            <td>{customer.balance}</td>
                            <td>
                                <Button variant="warning" size="sm" onClick={() => handleEdit(customer)}>
                                    Edit
                                </Button>
                                <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(customer.id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default CustomerManager;
