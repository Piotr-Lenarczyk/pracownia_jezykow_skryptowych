# Tic-Tac-Toe in Bash
## Functionality
- Turn-based
- Saving current gamestate
- Loading previous gamestate
- Playing with AI
## Installation
Download [tictactoe.sh](https://github.com/Piotr-Lenarczyk/pracownia_jezykow_skryptowych/blob/main/bash/tictactoe.sh) and copy it into your working directory.
## Usage
Follow the prompts of the script
## Saving the game
At any point during your turn, invoke the `save` command. Doing so will create a save file in the working directory and end the game.
## Loading the game
In most cases, assuming you've previously saved the game, you only need to provide the save file name to the script.
## Playing with AI
The AI will emulate a human player following the algorithm:
1) If there is a move that wins the game in current turn, make that move
2) Otherwise, if there is a move that the opponent can make during their next turn to win the game, block that move
3) In other cases, make a random move
