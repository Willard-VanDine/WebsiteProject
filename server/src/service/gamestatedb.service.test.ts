import { GamestateDBService } from './gamestateDB.service';
import { GamestateModel } from '../../db/modelloader';
import { winnerOfGame } from '../model/winnerOfGame.enum';
import { Choice } from '../model/choices.enum';

// Mock the GamestateModel static methods
// This allows us to simulate its behavior without
// actually interacting with the database (Because we want to be able to test without messing up data).
jest.mock('../../db/modelloader', () => ({
  GamestateModel: {
    // Jest.fn() used to make them mock functions which we can control return value sof
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

// GamestateDBService test suite:
describe('GamestateDBService tests (mocked!!)', () => {
  let gamestateService: GamestateDBService;
  let accountServiceMock: {
    findAccount: jest.Mock;
    updateAccount: jest.Mock;
    registerAccount: jest.Mock;
  };

  beforeEach(() => {
    // Create a fresh mock account service for each test
    accountServiceMock = {
      findAccount: jest.fn(),
      updateAccount: jest.fn(),
      registerAccount: jest.fn(),
    };
    gamestateService = new GamestateDBService(accountServiceMock);
    // Reset mocks for the DB model methods
    (GamestateModel.findOne as jest.Mock).mockReset();
    (GamestateModel.create as jest.Mock).mockReset();
  });

  describe('subscribeToGame', () => {
    test('should subscribe a user if not already subscribed (happy path)', async () => {
      const username = 'Luffy';
      // Simulate that the account exists
      accountServiceMock.findAccount.mockResolvedValue({ username });
      // Simulate no game state found for this user
      (GamestateModel.findOne as jest.Mock).mockResolvedValue(null);
      (GamestateModel.create as jest.Mock).mockResolvedValue({
        username,
        playerScore: 0,
        opponentScore: 0,
        gameName: 'Rock paper scissors',
        gameThreshold: 4,
        winnerOfGame: winnerOfGame.noWinner,
      });

      const result = await gamestateService.subscribeToGame(username);
      expect(result).toBe(true);
      expect(GamestateModel.create).toHaveBeenCalledWith({
        username,
        playerScore: 0,
        opponentScore: 0,
        gameName: 'Rock paper scissors',
        gameThreshold: 4,
        winnerOfGame: winnerOfGame.noWinner,
      });
    });

    test('should return undefined if account does not exist (unhappy path)', async () => {
      const username = 'NotLuffyThisTime';
      accountServiceMock.findAccount.mockResolvedValue(null);
      const result = await gamestateService.subscribeToGame(username);
      expect(result).toBeUndefined();
    });

    test('should return false if user is already subscribed', async () => {
      const username = 'Luffy';
      accountServiceMock.findAccount.mockResolvedValue({ username });
      // Simulate that a gamestate already exists
      (GamestateModel.findOne as jest.Mock).mockResolvedValue({
        username,
        playerScore: 0,
        opponentScore: 0,
        gameName: 'Rock paper scissors',
        gameThreshold: 4,
        winnerOfGame: winnerOfGame.noWinner,
      });
      const result = await gamestateService.subscribeToGame(username);
      expect(result).toBe(false);
    });
  });

  describe('startGame', () => {
    test('should reset the game for an existing user (happy path)', async () => {
      const username = 'Luffy';
      const fakeGamestate = {
        dataValues: {
          username,
          playerScore: 2,
          opponentScore: 1,
          gameName: 'Rock paper scissors',
          gameThreshold: 4,
          winnerOfGame: winnerOfGame.noWinner,
        },
        update: jest.fn().mockResolvedValue(true),
      };
      (GamestateModel.findOne as jest.Mock).mockResolvedValue(fakeGamestate);
      const result = await gamestateService.startGame(username);
      expect(result).toBeUndefined();
      expect(fakeGamestate.update).toHaveBeenCalledWith({
        playerScore: 0,
        opponentScore: 0,
      });
    });

    test('should return undefined if no gamestate is found (unhappy path)', async () => {
      const username = 'Per Olof Lennart';
      (GamestateModel.findOne as jest.Mock).mockResolvedValue(null);
      const result = await gamestateService.startGame(username);
      expect(result).toBeUndefined();
    });
  });

  describe('makeMove', () => {
    test('should update gamestate for a winning move by the player (happy path)', async () => {
      const username = 'Luffy';
      // Create a fake gamestate object with an update method
      const fakeGamestate = {
        dataValues: {
          username,
          playerScore: 0,
          opponentScore: 0,
          gameName: 'Rock paper scissors',
          gameThreshold: 4,
          winnerOfGame: winnerOfGame.noWinner,
        },
        update: jest.fn().mockImplementation(async (updateObj) => {
          // Fake-updating dataValues as the service normally expects
          fakeGamestate.dataValues = { ...fakeGamestate.dataValues, ...updateObj };
          return true;
        }),
      };

      (GamestateModel.findOne as jest.Mock).mockResolvedValue(fakeGamestate);
      // Spy on getOpponentChoice to force a specific value that lets the player win.
      // Player chooses Rock and we force the opponent's choice to Scissors.
      jest.spyOn<any, any>(gamestateService, 'getOpponentChoice').mockReturnValue(Choice.Scissors);
      const result = await gamestateService.makeMove(username, Choice.Rock);
      expect(result).toBeDefined(); // This is jest's "undefined check" pretty much
      // Since player wins the round and initial score is 0, the new score should be 1.
      expect(result?.playerScore).toBe(1);
      expect(result?.winnerOfGame).toBe(winnerOfGame.noWinner);
      expect(fakeGamestate.update).toHaveBeenCalled();
    });

    test('should return undefined if no gamestate is found (unhappy path)', async () => {
      const username = 'Per Olof Lennart';
      (GamestateModel.findOne as jest.Mock).mockResolvedValue(null);
      const result = await gamestateService.makeMove(username, Choice.Rock);
      expect(result).toBeUndefined();
    });
  });

  describe('getGameScore', () => {
    test('should return the current gamestate (happy path)', async () => {
      const username = 'Luffy';
      const fakeGamestate = {
        dataValues: {
          username,
          playerScore: 2,
          opponentScore: 3,
          gameName: 'Rock paper scissors',
          gameThreshold: 4,
          winnerOfGame: winnerOfGame.noWinner,
        },
      };

      (GamestateModel.findOne as jest.Mock).mockResolvedValue(fakeGamestate);
      const result = await gamestateService.getGameScore(username);
      expect(result).toEqual({
        playerScore: 2,
        opponentScore: 3,
        gameName: 'Rock paper scissors',
        gameThreshold: 4,
        winnerOfGame: winnerOfGame.noWinner,
      });
    });

    test('should return undefined if no gamestate is found (unhappy path)', async () => {
      const username = 'Per Olof Lennart';
      (GamestateModel.findOne as jest.Mock).mockResolvedValue(null);
      const result = await gamestateService.getGameScore(username);
      expect(result).toBeUndefined();
    });

    test('should throw an error wehn fields are NaN (unhappy path)', async () => {
      const username = 'Luffy';

      // Set all fields to NaN to see getGameScore dies inside and throws an error
      const fakeGamestate = {
        dataValues: {
          username: NaN,
          playerScore: NaN,
          opponentScore: NaN,
          gameName: NaN,
          gameThreshold: NaN,
          winnerOfGame: NaN,
        },
      };
      (GamestateModel.findOne as jest.Mock).mockResolvedValue(fakeGamestate);
      await expect(gamestateService.getGameScore(username)).rejects.toThrow("Both fields in the state are NaN.");
    });
    
  });

});
