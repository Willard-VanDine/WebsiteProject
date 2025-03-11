import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GameBoard from "./Gameboard";
import { getGameScore, makeMove } from "./api";
import { Choice } from "../../server/src/model/choices.enum";
import { winnerOfGame } from "../../server/src/model/winnerOfGame.enum";
import axios from "axios";

// Mock the alert function, otherwise we get a lot of errors
global.alert = jest.fn();

// Mock the api functions that we need to call to test GameBoard
jest.mock("./api", () => ({
    getGameScore: jest.fn(),
    makeMove: jest.fn()
}));

// Mock axios so we can check its calls
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("GameBoard Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("redirects to login if not logged in (unhappy path I guess)", () => {
        render(
            <MemoryRouter>
                <GameBoard isLoggedIn={false} />
            </MemoryRouter>
        );
        expect(screen.getByText(/Redirecting to login/i)).toBeInTheDocument();
    });

    test("renders gameboard if logged in (happy path)", async () => {
        (getGameScore as jest.Mock).mockResolvedValue({ playerScore: 0, opponentScore: 0 });

        render(
            <MemoryRouter>
                <GameBoard isLoggedIn={true} />
            </MemoryRouter>
        );

        await waitFor(() => expect(getGameScore).toHaveBeenCalled());
        expect(screen.getByText(/Player score: 0/i)).toBeInTheDocument();
        expect(screen.getByText(/Opponent score: 0/i)).toBeInTheDocument();
    });

    test("updates the score after making a move", async () => {
        // First call returns initial scores.
        (getGameScore as jest.Mock).mockResolvedValueOnce({ playerScore: 0, opponentScore: 0 });
        
        // We implement makeMove to check post-call
        (makeMove as jest.Mock).mockImplementation(async (playerChoice: Choice) => {
            await mockedAxios.post("http://localhost:8080/gameboard", { playerChoice });
            return ({ playerScore: 1, opponentScore: 0, winnerOfGame: winnerOfGame.noWinner });
        });

        render(
            <MemoryRouter>
                <GameBoard isLoggedIn={true} />
            </MemoryRouter>
        );

        await waitFor(() => expect(getGameScore).toHaveBeenCalled());

        const rockButton = screen.getByText(Choice.Rock);
        fireEvent.click(rockButton);

        // Second call returns updated scores...
        (getGameScore as jest.Mock).mockResolvedValueOnce({ playerScore: 1, opponentScore: 0 });
        await waitFor(() => expect(makeMove).toHaveBeenCalledWith(Choice.Rock));

        // Check that axios.post was called with the correct URL and payload :)
        await waitFor(() =>
            expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:8080/gameboard", { playerChoice: "Rock" })
        );

        // ...and the updated scores are displayed
        await waitFor(() => expect(screen.getByText(/Player score: 1/i)).toBeInTheDocument());
    });

    test("displays correct round result after someone wins", async () => {
        (getGameScore as jest.Mock).mockResolvedValue({ playerScore: 3, opponentScore: 0 });
        
        // Simulate a direct response for winnign 
        (makeMove as jest.Mock).mockResolvedValue({ playerScore: 4, opponentScore: 0, winnerOfGame: winnerOfGame.noWinner });

        render(
            <MemoryRouter>
                <GameBoard isLoggedIn={true} />
            </MemoryRouter>
        );

        const rockButton = screen.getByText(Choice.Rock);
        fireEvent.click(rockButton);

        // Check if the round's result is displayed as expected
        await waitFor(() => expect(screen.getByText(/You Win!/i)).toBeInTheDocument());
        
    });
    
});
