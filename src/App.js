import React from 'react';
import CustomerManager from './Components/customerManager';
import { Container } from 'react-bootstrap';


const App = () => {
    return (
        <Container className="App">
            <h1>Bank App</h1>
            <CustomerManager />
        </Container>
    );
};

export default App;
