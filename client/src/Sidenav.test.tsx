import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidenav from "./Sidenav";
import { logOut } from "./api";

// Mock the alert function, otherwise we get a lot of errors
global.alert = jest.fn();

// Mock the logOut function from ./api
jest.mock("./api", () => ({
  logOut: jest.fn(),
}));

// Test suite for Sidenav:
describe("Sidenav", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Home, Register and Login when NOT logged in", () => {
    render(
      <MemoryRouter>
        <Sidenav isLoggedIn={false} setIsLoggedIn={jest.fn()} />
      </MemoryRouter>
    );

    // Ensure that the links that should be present are present
    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();

    // Ensure that logged-in-exlcusive links are not present
    expect(screen.queryByText("Gameboard")).not.toBeInTheDocument();
    expect(screen.queryByText("Account")).not.toBeInTheDocument();
    expect(screen.queryByText("Log Out")).not.toBeInTheDocument();
  });

  test("renders Gameboard, Account and Log Out when logged in", () => {
    const setIsLoggedIn = jest.fn();
    render(
      <MemoryRouter>
        <Sidenav isLoggedIn={true} setIsLoggedIn={setIsLoggedIn} />
      </MemoryRouter>
    );

    // These should be visible when logged in!
    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByText("Gameboard")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Log Out")).toBeInTheDocument();

    // The Login link should not be visible when logged in... as you're logged in already
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  test("clicking Log Out calls logOut, sets isLoggedIn to false, and alerts", async () => {
    const setIsLoggedIn = jest.fn();
    // Set up logOut to resolve
    (logOut as jest.Mock).mockResolvedValueOnce(undefined);
    
    render(
      <MemoryRouter>
        <Sidenav isLoggedIn={true} setIsLoggedIn={setIsLoggedIn} />
      </MemoryRouter>
    );

    // Get log out button and click it
    const logoutButton = screen.getByText("Log Out");
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(logOut).toHaveBeenCalled();
      expect(setIsLoggedIn).toHaveBeenCalledWith(false);
      expect(global.alert).toHaveBeenCalledWith("Logged Out");
    });
  });
});
