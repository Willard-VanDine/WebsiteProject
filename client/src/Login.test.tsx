import { act, render } from '@testing-library/react';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import axios from 'axios';
import Login from './Login';
import { MemoryRouter } from 'react-router-dom';
import { login } from './api';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedNavigate = jest.fn();

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockedNavigate,
}));


jest.mock("./api", () => ({
    login: jest.fn(),
}));

// Mocking setIsLoggedIn for rendering login page 
const mockSetIsLoggedIn = jest.fn();

describe('Login Component', () => {

    // Mock the alert function, otherwise we get a lot of errors
    global.alert = jest.fn();

    test('Renders Login startup page', () => {
        render(<MemoryRouter>  <Login isLoggedIn={false} setIsLoggedIn={mockSetIsLoggedIn} /></MemoryRouter>);

        // Field input & login button
        const usernameInput = screen.getByLabelText(/Username/i);
        const passwordInput  = screen.getByLabelText(/Password/i);

        // Login button
        const startupMsg = screen.getByText(/Login Page/i);

        // Navigation link 
        const backLink = screen.getByRole('link', { name: /Register new user/i });

        waitFor(() => {
            // Verify that the title "Login Page" exists
            expect(startupMsg).toBeInTheDocument();

            // Verify that the username & passwrd input field is displayed
            expect(usernameInput).toBeInTheDocument();
            expect(passwordInput).toBeInTheDocument();

            // Verify that the navigation link exists
            expect(backLink).toBeInTheDocument();
        })

    });

    
            
    test('Login with an invalid user', async () => {
        (login as jest.Mock).mockResolvedValue({ loggedIn: false });

        render(<MemoryRouter>  <Login isLoggedIn={false} setIsLoggedIn={mockSetIsLoggedIn} /> </MemoryRouter>);

        // Field input & login button
        const usernameInput = screen.getByLabelText(/Username/i);
        const passwordInput  = screen.getByLabelText(/Password/i);
        const loginButton = screen.getByRole('button', { name: /Log In/i });

        // Simulate click on the login button & user typing
        await act(() => {
            fireEvent.change(usernameInput, { target: { value: '' } });
            fireEvent.change(passwordInput, { target: { value: '' } });
            fireEvent.click(loginButton);
        });

        // Expects to send a post request to login an user
        //expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:8080/account/login", { username: '', password: ''});

        // Verify alert
        expect(global.alert).toHaveBeenCalledWith("Login failed. Please check your username and password.");
    });

    test('Login with an valid user', async () => {
        (login as jest.Mock).mockResolvedValue({ loggedIn: true });

        // Simulate a successful login response
        mockedAxios.post.mockResolvedValue({
            data: {
                loggedIn: true, // Simulated response from the server
            },
        });


        render(<MemoryRouter>  <Login isLoggedIn={false} setIsLoggedIn={mockSetIsLoggedIn} /> </MemoryRouter>);


        // Field input & login button
        const usernameInput = screen.getByLabelText(/Username/i);
        const passwordInput  = screen.getByLabelText(/Password/i);
        const loginButton = screen.getByRole('button', { name: /Log In/i });

        // Simulate click on the login button & user typing
        await act(() => {
            fireEvent.change(usernameInput, { target: { value: 'blackbeard' } });
            fireEvent.change(passwordInput, { target: { value: 'Peoples Dreams...Have No End' } });
            fireEvent.click(loginButton);
        });

        // Expects to send a post request to login an user
        //expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:8080/account/login", { username: 'blackbeard', password: 'Peoples Dreams...Have No End'});

        // Ensure the navigation happenes to the homepage
        expect(mockedNavigate).toHaveBeenCalledWith("/");

    });

});