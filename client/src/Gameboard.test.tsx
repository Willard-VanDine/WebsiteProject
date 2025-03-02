import { act, render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import Gameboard from './Gameboard';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Gameboard Component', () => {

    test('Renders gameboard startup message', () => {
        render(<Gameboard />);
        const startupMsg = screen.getByText(/Make a choice to play!/i);
        expect(startupMsg).toBeInTheDocument();
    });
    
    test('Updates result when Rock is chosen', async () => {
        render(<Gameboard />);

        const mockResult = { result: 1 }; // Win scenario
        const mockScore = { playerScore: 1, opponentScore: 0 };

        // Mock axios API responses
        mockedAxios.post.mockResolvedValue({data : mockResult});
        mockedAxios.get.mockResolvedValue({data : mockScore});

        // Simulate click on the Rock button
        const rockButton = screen.getByRole('button', { name: /Rock/i });
        await act(() => {
            fireEvent.click(rockButton);
        });

        expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:8080/gameboard", { playerChoice: "Rock" });

        // Wait for the result text to appear
        const resultText = screen.getByText(/You Win!/i);

        // Verify that the result text and visual change
        expect(resultText).toBeInTheDocument();
        expect(screen.getByTestId(/PlayerVisual/)).toHaveTextContent('Rock');
        expect(screen.getByTestId(/OpponentVisual/)).toHaveTextContent('Scissor');

        // Verify that the score was updated
        expect(screen.getByText(/Player score: 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Opponent score: 0/i)).toBeInTheDocument();
    });

    test('Updates result when Paper is chosen', async () => {
        render(<Gameboard />);

        const mockResult = { result: 1 }; // Win scenario
        const mockScore = { playerScore: 1, opponentScore: 0 };

        // Mock axios API responses
        mockedAxios.post.mockResolvedValue({data : mockResult});
        mockedAxios.get.mockResolvedValue({data : mockScore});

        // Simulate click on the Rock button
        const paperButton = screen.getByRole('button', { name: /Paper/i });
        await act(() => {
            fireEvent.click(paperButton);
        });

        expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:8080/gameboard", { playerChoice: "Paper" });

        // Wait for the result text to appear
        const resultText = screen.getByText(/You Win!/i);

        // Verify that the result text and visual change
        expect(resultText).toBeInTheDocument();
        expect(screen.getByTestId(/PlayerVisual/)).toHaveTextContent('Paper');
        expect(screen.getByTestId(/OpponentVisual/)).toHaveTextContent('Rock');

        // Verify that the score was updated
        expect(screen.getByText(/Player score: 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Opponent score: 0/i)).toBeInTheDocument();
    });

    test('Updates result when Scissor is chosen', async () => {
        render(<Gameboard />);

        const mockResult = { result: 1 }; // Win scenario
        const mockScore = { playerScore: 1, opponentScore: 0 };

        // Mock axios API responses
        mockedAxios.post.mockResolvedValue({data : mockResult});
        mockedAxios.get.mockResolvedValue({data : mockScore});

        // Simulate click on the Rock button
        const scissorButton = screen.getByRole('button', { name: /Scissor/i });
        await act(() => {
            fireEvent.click(scissorButton);
        });

        expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:8080/gameboard", { playerChoice: "Scissors" });

        // Wait for the result text to appear
        const resultText = screen.getByText(/You Win!/i);

        // Verify that the result text and visual change
        expect(resultText).toBeInTheDocument();
        expect(screen.getByTestId(/PlayerVisual/)).toHaveTextContent('Scissor');
        expect(screen.getByTestId(/OpponentVisual/)).toHaveTextContent('Paper');

        // Verify that the score was updated
        expect(screen.getByText(/Player score: 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Opponent score: 0/i)).toBeInTheDocument();
    });

    test('Opponent gets score when player loses', async () => {
        render(<Gameboard />);

        const mockResult = { result: -1 }; // Win scenario
        const mockScore = { playerScore: 0, opponentScore: 1 };

        // Mock axios API responses
        mockedAxios.post.mockResolvedValue({data : mockResult});
        mockedAxios.get.mockResolvedValue({data : mockScore});

        // Simulate click on the Rock button
        const scissorButton = screen.getByRole('button', { name: /Scissor/i });
        await act(() => {
            fireEvent.click(scissorButton);
        });

        expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:8080/gameboard", { playerChoice: "Scissors" });

        // Wait for the result text to appear
        const resultText = screen.getByText(/You Lose!/i);

        // Verify that the result text and visual change
        expect(resultText).toBeInTheDocument();
        expect(screen.getByTestId(/PlayerVisual/)).toHaveTextContent('Scissor');
        expect(screen.getByTestId(/OpponentVisual/)).toHaveTextContent('Rock');

        // Verify that the score was updated
        expect(screen.getByText(/Player score: 0/i)).toBeInTheDocument();
        expect(screen.getByText(/Opponent score: 1/i)).toBeInTheDocument();
    });

});
