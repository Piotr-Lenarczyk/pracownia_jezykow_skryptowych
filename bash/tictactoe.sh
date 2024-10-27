#!/bin/bash

declare -A field
rows=3
columns=3
character="o"
win=0
draw=0

function new_game(){
	echo "Initializing game..."
	for((i=0; i<rows; i++)) do
		for((j=0; j<columns; j++)) do
			field[$i,$j]=" "
		done
	done
}

function print_game_state() {
	echo "${field[0,0]}|${field[0,1]}|${field[0,2]}"
	echo "-----"
	echo "${field[1,0]}|${field[1,1]}|${field[1,2]}"
	echo "-----"
	echo "${field[2,0]}|${field[2,1]}|${field[2,2]}"
}

function insert_character() {
	if [[ ${field[$2,$3]} == " " ]] ; then
		field[$2,$3]=$1
	else
		echo "Incorrect position"
		if [[ $character == "o" ]]; then
                        character="x"
                else
                        character="o"
                fi
	fi
}

function check_win_condition() {
	for ((i=0; i<3; i++)) do
		# Horizontal win
		if [[ ${field[$i,0]} != " " && ${field[$i,0]} == ${field[$i,1]} && ${field[$i,0]} == ${field[$i,2]} ]]; then
			win=1
			return 0
		# Vertical win
		elif [[ ${field[0,$i]} != " " && ${field[0,$i]} == ${field[1,$i]} && ${field[0,$i]} == ${field[2,$i]} ]]; then
                        win=1
			return 0
		fi
	done
	# Diagonal win
	if [[ ${field[0,0]} != " " && ${field[0,0]} == ${field[1,1]} && ${field[0,0]} == ${field[2,2]} ]]; then
		win=1
		return 0
	elif [[ ${field[0,2]} != " " && ${field[0,2]} == ${field[1,1]} && ${field[0,2]} == ${field[2,0]} ]]; then
		win=1
		return 0
	fi
	# Draw
	for((i=0; i<rows; i++)) do
		for((j=0; j<columns; j++)) do
			if [[ ${field[$i,$j]} != " " ]]; then
                       		return 0
			fi
		done
	done
	draw=1
}

echo "Select an option:"
echo "1) New game"
echo "2) Load previous game (WIP)"
read command
if [[ $command == "1" ]] ; then
	echo "New game selected"
	new_game
	while true
	do
		while true
		do
			print_game_state
                	echo "Player $character, enter position: "
			read pos1 pos2
			insert_character "$character" "$pos1" "$pos2"
			if (( $pos1 >= 0 && $pos1 <= 2 && $pos2 >= 0 && $pos2 <= 2 )); then
				break
			else
				if [[ $character == "o" ]]; then
					character="x"
				else
					character="o"
				fi
			fi
		done
		check_win_condition
		if [[ $win == 1 ]]; then
			print_game_state
			echo "Player $character wins!"
			break
		elif [[ $draw == 1 ]]; then
			print_game_state
			echo "No valid spaces left, game ends in a draw"
			break
		fi
		if [[ $character == "o" ]]; then
			character="x"
		else
			character="o"
		fi
	done
elif [[ $command == "2" ]] ; then
	echo "Load previous game selected"
else
	echo "Unrecognized command"
fi
