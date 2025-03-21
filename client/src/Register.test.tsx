import { act, render } from '@testing-library/react';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import axios from 'axios';
import Register from './Register';
import { MemoryRouter } from 'react-router';
import { registerUser } from './api';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedNavigate = jest.fn();

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockedNavigate,
}));

jest.mock("./api", () => ({
    registerUser: jest.fn(),
}));

describe('Register Component', () => {

    // Mock the alert function, otherwise we get a lot of errors
    global.alert = jest.fn();

    test('Renders Register startup page', async () => {

        render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
        );
        const startupMsg = screen.getByText(/Register New User/i);

        // Field input & register button
        const usernameInput = screen.getByLabelText(/Username/i);
        const passwordInput  = screen.getByLabelText(/Password/i);

        await waitFor(()=> {
            expect(usernameInput).toBeInTheDocument();
            expect(passwordInput).toBeInTheDocument();
    
            expect(startupMsg).toBeInTheDocument();
        })

    });

    
            
    test('Register a user with too short name/password', async () => {
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
            );

        // Field input & register button
        const usernameInput = screen.getByLabelText(/Username/i);
        const passwordInput  = screen.getByLabelText(/Password/i);
        const registerButton = screen.getByRole('button', { name: /Register/i });

       // Simulate click on the register button & user typing
        await waitFor(() => {
            fireEvent.change(usernameInput, { target: { value: 'a' } });
            fireEvent.change(passwordInput, { target: { value: 'a' } });
            fireEvent.click(registerButton);
        });

        // Expects to send a post request to register an user
        await waitFor(() => {
            // Expects to send a post request to register an user
            expect(mockedAxios.post).not.toHaveBeenCalledWith("http://localhost:8080/account", { username: "a", password: "a"});
            // Verify alert
            expect(global.alert).toHaveBeenCalledWith("Please make sure your username and password meet the length requirements.");
        })

    });

    test('Attempt to register an already existing user', async () => {
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
            );

        // Field input & register button
        const usernameInput = screen.getByLabelText(/Username/i);
        const passwordInput  = screen.getByLabelText(/Password/i);
        const registerButton = screen.getByRole('button', { name: /Register/i });

        // Simulate click on the register button & user typing
        (registerUser as jest.Mock).mockResolvedValueOnce(true);
        await act(() => {
            fireEvent.change(usernameInput, { target: { value: 'Whitebeard' } });
            fireEvent.change(passwordInput, { target: { value: '12345678' } });
            fireEvent.click(registerButton);
        });
        
        (registerUser as jest.Mock).mockResolvedValueOnce(false);
        await act(() => {
            fireEvent.change(usernameInput, { target: { value: 'Whitebeard' } });
            fireEvent.change(passwordInput, { target: { value: '12345678' } });
            fireEvent.click(registerButton);
        });

        // Expects to send a post request to register an user
        await waitFor(() => {
            // Expects to send a post request to register an user
            //expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:8080/account", { username: '', password: ''});
            
            // Verify alert
            expect(global.alert).toHaveBeenCalledWith("An error occurred!");

            // Ensure the navigation happenes to the homepage
            expect(mockedNavigate).toHaveBeenCalledWith("/");
        })

    });

    test('Register a valid user', async () => {
        (registerUser as jest.Mock).mockResolvedValue(true);
        mockedAxios.post.mockResolvedValue({ data: true });

        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
            );

        // Field input & register button
        const usernameInput = screen.getByLabelText(/Username/i);
        const passwordInput  = screen.getByLabelText(/Password/i);
        const registerButton = screen.getByRole('button', { name: /Register/i });

        // Simulate click on the register button & user typing
        await act(() => {
            fireEvent.change(usernameInput, { target: { value: 'blackbeard' } });
            fireEvent.change(passwordInput, { target: { value: 'Peoples Dreams...Have No End' } });
            fireEvent.click(registerButton);
        });

        await waitFor(() => {
            // Expects to send a post request to register an user
            //expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:8080/account", { username: 'blackbeard', password: 'Peoples Dreams...Have No End'});

            
            // Verify alert
            expect(global.alert).toHaveBeenCalledWith("Registration successful!");

            // Ensure the navigation happenes to the homepage
            expect(mockedNavigate).toHaveBeenCalledWith("/");
        })

        

    });

});