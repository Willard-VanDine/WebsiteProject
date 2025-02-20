import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Gameboard from './Gameboard';

describe('Gameboard Component', () => {

    test('Renders gameboard startup message', () => {
        render(<Gameboard />);
        const startupMsg = screen.getByText(/Make a choice to play!/i);
        expect(startupMsg).toBeInTheDocument();
    });

    /*
    test('Updates startup message when playing', () => {
        render(<Gameboard />);
        expect(screen.getByText(/Make a choice to play!/i)).toBeInTheDocument();

        const rockButton = screen.getByRole('button', {name: /Rock/i});
        fireEvent.click(rockButton);
        
        const newMsg = screen.getByTestId("GameroundResultText");
        console.log(newMsg.getHTML());
        expect( newMsg.innerHTML === "You Win!" || 
                newMsg.innerHTML === "Draw!"    || 
                newMsg.innerHTML === "You Lose!")
                .toBeTruthy();
    });
    */
});
