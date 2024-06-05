import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';

import '@testing-library/jest-dom/extend-expect';
import CustomerManager from './customerManager';

jest.mock('axios');

const customersMockData = [
    {
        id: 1,
        username: 'user1',
        password: 'pass1',
        firstName: 'First1',
        lastName: 'Last1',
        city: 'City1',
        balance: 100
    },
    {
        id: 2,
        username: 'user2',
        password: 'pass2',
        firstName: 'First2',
        lastName: 'Last2',
        city: 'City2',
        balance: 200
    }
];

describe('CustomerManager Component', () => {
    beforeEach(() => {
        axios.get.mockResolvedValue({ data: customersMockData });
    });

    test('renders CustomerManager component correctly', async () => {
        render(<CustomerManager />);

        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        expect(screen.getByText('Add Customer')).toBeInTheDocument();
        expect(screen.getByText('Customer List')).toBeInTheDocument();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/balance/i)).toBeInTheDocument();

        // Verify if customer list is rendered
        await waitFor(() => expect(screen.getByText('user1')).toBeInTheDocument());
        expect(screen.getByText('First1')).toBeInTheDocument();
        expect(screen.getByText('City1')).toBeInTheDocument();
    });

    test('can fill out and submit the form', async () => {
        render(<CustomerManager />);

        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'newuser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'newpass' } });
        fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'NewFirst' } });
        fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'NewLast' } });
        fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'NewCity' } });
        fireEvent.change(screen.getByLabelText(/balance/i), { target: { value: 300 } });

        axios.post.mockResolvedValue({});

        fireEvent.click(screen.getByText(/add customer/i));

        await waitFor(() => expect(axios.post).toHaveBeenCalledWith('http://localhost:8889/api/register', {
            id: '',
            username: 'newuser',
            password: 'newpass',
            firstName: 'NewFirst',
            lastName: 'NewLast',
            city: 'NewCity',
            balance: 300
        }));

        expect(screen.getByLabelText(/username/i).value).toBe('');
    });

    test('can edit a customer', async () => {
        render(<CustomerManager />);

        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        fireEvent.click(screen.getByText(/edit/i));

        await waitFor(() => {
            expect(screen.getByLabelText(/username/i).value).toBe('user1');
        });

        fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'UpdatedFirst' } });

        axios.put.mockResolvedValue({});

        fireEvent.click(screen.getByText(/save changes/i));

        await waitFor(() => expect(axios.put).toHaveBeenCalledWith('http://localhost:8889/api/profile/user1', {
            id: 1,
            username: 'user1',
            password: 'pass1',
            firstName: 'UpdatedFirst',
            lastName: 'Last1',
            city: 'City1',
            balance: 100
        }));

        expect(screen.getByLabelText(/username/i).value).toBe('');
    });

    test('can delete a customer', async () => {
        render(<CustomerManager />);

        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        axios.delete.mockResolvedValue({});

        fireEvent.click(screen.getByText(/delete/i));

        await waitFor(() => expect(axios.delete).toHaveBeenCalledWith('http://localhost:8889/api/delete/1'));
    });
});
