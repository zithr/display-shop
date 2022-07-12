<script>
	import supabase from '$lib/db';
	import { getSearchParamFromUrl } from '$lib/functions';
	import { onMount } from 'svelte';

	$: turn = 'Noughts';
	$: winner = '';
	const square_css = 'h-24 w-24 flex items-center justify-center ring-inset ring-blue-500';

	// represent board
	// 0 = empty, 1 = nought, 2 = cross
	$: board = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];

	let board_id = null;
	let local_board = true;
	let winner_msg = '';

	// get latest board from db
	// should be latest board from active player though
	// get board of board id
	const getboard = async (board_id) => {
		let { data: boards, error } = await supabase
			.from('boards')
			.select('*')
			.eq('id', board_id)
			.order('id', { ascending: false })
			.limit(1)
			.single();
		// console.log(boards, error);
		if (error) {
			console.log(error)
		}
		if (!boards) {
			alert("Board not found!")
			return
		}
		updateboard(boards);
	};

	// load & subscribe to the board on page mount
	onMount(async () => {
		board_id = getSearchParamFromUrl('board_id');

		// if no id, set local board for testing
		if (!board_id) {
			return;
		}
		local_board = false;
		getboard();
		const mySubscription = supabase
			.from('boards')
			.on('INSERT', (payload) => {
				updateboard(payload.new);
				// console.log('Change received!', payload);
			})
			.subscribe();
	});

	// display new board info
	const updateboard = (board_info) => {
		board = board_info.board.layout;

		// check for win if not new game
		if (board_info.last_move != 0) wincheck(board_info);
		board_info.last_move === 1 ? (turn = 'Crosses') : (turn = 'Noughts');

		// for new game
		if (board_info.last_move === 0) {
			turn = 'Noughts';
		}
	};

	// check for wins
	const wincheck = (check_board) => {
		// win can be found with board state and location of last played piece
		const x = check_board.last_loc[0];
		const y = check_board.last_loc[1];
		const piece = check_board.last_move;
		const check = check_board.board.layout;
		let draw = true;

		// check columns
		for (let i = 0; i < 3; i++) {
			if (check[x][i] != piece || winner) break;
			if (i == 2) {
				piece === 1 ? (winner = 'Noughts') : (winner = 'Crosses');
			}
			if (winner) return
		}
		//check row
		for (let i = 0; i < 3; i++) {
			if (board[i][y] != piece || winner) break;
			if (i == 2) {
				piece === 1 ? (winner = 'Noughts') : (winner = 'Crosses');
			}
			if (winner) return
		}
		//check diag
		if (x == y) {
			//we're on a diagonal
			for (let i = 0; i < 3; i++) {
				if (board[i][i] != piece || winner) break;
				if (i == 2) {
					piece === 1 ? (winner = 'Noughts') : (winner = 'Crosses');
				}
				if (winner) return
			}
		}
		//check anti diag
		if (x + y == 2) {
			for (let i = 0; i < 3; i++) {
				if (board[i][2 - i] != piece) break;
				if (i == 2) {
					piece === 1 ? (winner = 'Noughts') : (winner = 'Crosses');
				}
				if (winner) return
			}
		}

		//tie check at end
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (check[i][j] == 0) {
					draw = false;
					break;
				}
			}
		}
		if (draw) {
			winner = 'Tie';
			return;
		}
	};

	// add new board info to db
	const insertboard = async (board, last_move, last_loc) => {
		if (local_board) {
			let board_info = { board: { layout: board }, last_move: last_move, last_loc: last_loc };
			// console.log("0clue")
			updateboard(board_info);
			return;
		}
		const { data, error } = await supabase
			.from('boards')
			.insert([{ board: { layout: board }, last_move: last_move, last_loc: last_loc }]);
		return;
	};

	// create pattern as board
	const boardcolour = (x, y) => {
		if ((x + y + 2) % 2 === 0) return 'bg-gray-600';
		else return 'bg-gray-300';
	};

	// reset board back to start, add to db
	const resetboard = () => {
		board = [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0]
		];
		insertboard(board, 0);
		winner = '';
	};

	// place alternating noughts & crosses on tile x,y
	// 0 = empty, 1 = nought, 2 = crosses
	const place = (x, y) => {
		if (board[x][y] === 0 && !winner) {
			if (turn === 'Noughts') {
				board[x][y] = 1;
				insertboard(board, 1, [x, y]);
			} else {
				board[x][y] = 2;
				insertboard(board, 2, [x, y]);
			}
		}
	};

	// takes array integer and returns noughts (empty since using tailwind to draw circle) or x for cross
	const piece = (num) => {
		if (num === 2) return 'x';
		return '';
	};

	// takes array integer output tailwind styles to draw circle for nought, style x for cross
	const classpiece = (num) => {
		if (num === 1) return 'w-16 h-16 bg-none rounded-full border-4 border-blue-700';
		else if (num === 2) return '-mt-8 text-8xl text-red-700';
		return '';
	};

	// winner message/css
	const winnercolour = (winner) => {
		if (winner === 'Noughts') {
			winner_msg = 'Noughts wins!';
			return 'text-blue-700';
		}
		if (winner === 'Crosses') {
			winner_msg = 'Crosses wins!';
			return 'text-red-700';
		}
		winner_msg = 'Its a tie!'
		return 'text-gray-700'
	};

	// game over, block cursor
	const cursorwinner = (winner) => {
		if (!winner) {
			return 'cursor-pointer hover:ring-4';
		}
		return 'cursor-not-allowed';
	};
</script>

<div class="container mx-auto py-2">
	<div class="text-3xl pb-2 text-gray-600 font-bold underline">Tic-Tac-Toe</div>
	{#if !winner}
		<div class="my-3 text-xl text-gray-400">{turn} to move!</div>
	{/if}
	<div class="flex">
		<board>
			{#each board as _sq, i}
				<div class="flex-col">
					<div class="flex">
						{#each board[i] as _sq2, j}
							<div
								class={`${boardcolour(i, j)} ${cursorwinner(winner)} ${square_css}`}
								on:click={() => place(i, j)}
							>
								<div class={`${classpiece(board[i][j])}`}>{piece(board[i][j])}</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</board>
		{#if winner}
			<div class="flex-col">
				<div class="flex h-full px-4">
					<div
						class={`flex items-center justify-center text-center text-2xl font-black ${winnercolour(
							winner
						)}`}
					>
						{winner_msg}
					</div>
				</div>
			</div>
		{/if}
	</div>
	<button
		class="my-3 px-3 py-4 bg-blue-300 rounded-md shadow-lg hover:bg-blue-500"
		on:click={resetboard}>Reset board</button
	>
</div>
