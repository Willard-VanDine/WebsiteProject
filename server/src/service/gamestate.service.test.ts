import { GamestateService } from './gamestate.service';
import { Choice } from '../model/choices.enum';
import { AccountService } from './account.service';

  let gamestateService: GamestateService;

  beforeEach(async () => {
    let testAccount : AccountService = new AccountService();
    await testAccount.registerAccount("test", "123");
    gamestateService = new GamestateService(testAccount);
  });


  afterEach(() => {
    jest.restoreAllMocks();  // Cleanup any mocks after each test
  });

test("Should reset the game state and scores whenever a new game is started", async () => {
  

    jest.spyOn(gamestateService as any, 'getOpponentChoice').mockReturnValue(Choice.Scissors);
    await gamestateService.makeMove("test", Choice.Rock);
    await gamestateService.startGame("test");
    expect(await gamestateService.getGameScore("test")).toStrictEqual({playerScore: 0, opponentScore: 0})
});


//TODO: maybe we should remove this test, as it is essentially testing a private method rather than a public one
// Merely used as a sanity check
test("The opponent should be able to select Rock, Paper and Scissors", async () => {
    // Set math.random() to a flat value, to make sure it is not non-deterministic being with 0.3.
    // which should return Rock

    jest.spyOn(Math, 'random').mockReturnValue(0.3);
    var choice: Choice = (gamestateService as any).getOpponentChoice();
    expect(choice).toBe(Choice.Rock);

    //Value that should pick paper

    jest.spyOn(Math, 'random').mockReturnValue(0.6);
    choice = (gamestateService as any).getOpponentChoice();
    expect(choice).toBe(Choice.Paper);

    //Value that should pick scissors

    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    choice = (gamestateService as any).getOpponentChoice();
    expect(choice).toBe(Choice.Scissors);

});

test("The user should be able to choose Rock", async () => {
    // This tests tests the input Choice.Rock and tests wheter or not it returns the proper values
    // Such as Rock vs Scissor should return 1 for victory etc.

    jest.spyOn(gamestateService as any, 'getOpponentChoice').mockReturnValue(Choice.Scissors);
    expect(await gamestateService.makeMove("test", Choice.Rock)).toBe(1);

    jest.spyOn(gamestateService as any, 'getOpponentChoice').mockReturnValue(Choice.Rock);
    expect(await gamestateService.makeMove("test" , Choice.Rock)).toBe(0);

    jest.spyOn(gamestateService as any, 'getOpponentChoice').mockReturnValue(Choice.Paper);
    expect(await gamestateService.makeMove("test", Choice.Rock)).toBe(-1);




});


test("The user should be able to choose Paper", async () => {
    // This tests tests the input Choice.Rock and tests wheter or not it returns the proper values

    jest.spyOn(gamestateService as any, 'getOpponentChoice').mockReturnValue(Choice.Scissors);
    expect(await gamestateService.makeMove("test", Choice.Paper)).toBe(-1);

    jest.spyOn(gamestateService as any, 'getOpponentChoice').mockReturnValue(Choice.Rock);
    expect(await gamestateService.makeMove("test", Choice.Paper)).toBe(1);

    jest.spyOn(gamestateService as any, 'getOpponentChoice').mockReturnValue(Choice.Paper);
    expect(await gamestateService.makeMove("test", Choice.Paper)).toBe(0);




});

test("The user should be able to choose Scissors", async () => {
    // This tests tests the input Choice.Scissors and tests wheter or not it returns the proper values

    jest.spyOn(gamestateService as any, 'getOpponentChoice').mockReturnValue(Choice.Scissors);
    expect(await gamestateService.makeMove("test", Choice.Scissors)).toBe(0);

    jest.spyOn(gamestateService as any, 'getOpponentChoice').mockReturnValue(Choice.Rock);
    expect(await gamestateService.makeMove("test", Choice.Scissors)).toBe(-1);

    jest.spyOn(gamestateService as any, 'getOpponentChoice').mockReturnValue(Choice.Paper);
    expect(await gamestateService.makeMove("test", Choice.Scissors)).toBe(1);




});

test("The User should be able to check the score", async () => {
    // Checks if it returns the correct values at the start, then checks wheter or not it increases the
    // Correct score
    await gamestateService.startGame("test");
    expect(await gamestateService.getGameScore("test")).toStrictEqual(({playerScore: 0, opponentScore: 0}));

    jest.spyOn(gamestateService as any, 'getOpponentChoice').mockReturnValue(Choice.Scissors);
    await gamestateService.makeMove("test", Choice.Rock);


    expect(await gamestateService.getGameScore("test")).toStrictEqual(({playerScore: 1, opponentScore: 0}));


});



