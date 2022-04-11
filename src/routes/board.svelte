<script>
	const square_css =
		'h-24 w-24 flex items-center justify-center cursor-pointer ring-inset hover:ring-4 ring-blue-500';
	let turn = 'Noughts';
	let board = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];

	const boardcolour = (x,y) => {
		if ( (x+y+2)%2 === 0) return "bg-gray-600"
		else return "bg-gray-300"
	}
	const resetboard = () => {
		board = [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0]
		];
	};
	const place = (x, y) => {
		if (board[x][y] === 0) {
			if (turn === 'Noughts') {
				turn = 'Crosses';
				board[x][y] = 1;

			} else {
				turn = 'Noughts';
				board[x][y] = 2;

			}
		}
	};

	const piece = (num) => {
		if (num === 1) return '';
		else if (num === 2) return 'x';
		return '';
	};

	const classpiece = (num) => {
		if (num === 1) return 'w-16 h-16 bg-none rounded-full border-4 border-blue-700';
		else if (num === 2) return '-mt-8 text-8xl text-red-700';
		return '';
	};
</script>

<div class="container mx-auto py-4">
	<div class="text-3xl">Tic-Tac-Toe</div>
	<div class="my-3 text-xl">{turn} to move!</div>
	<board>
		{#each board as sq, i}
		<div class="flex-col">
			<div class= "flex">
				{#each board[i] as sq2, j}
				<div class={`${boardcolour(i,j)} ${square_css}`} on:click={() => place(i, j)}>
					<div class={`${classpiece(board[i][j])}`}>{piece(board[i][j])}</div>
				</div>
				{/each}
			</div>
		</div>
		{/each}
	</board>
	<button class="my-3 px-3 py-4 bg-blue-300 rounded-md shadow-lg" on:click={resetboard}>Reset board</button>
</div>


<!-- <div class="container mx-auto py-12">
	<button on:click={resetboard}>Reset board</button>
	<board>
		<div class="flex-col">
			<div class="flex">
				<div class={`${boardcolour(0,0)} ${square_css}`} on:click={() => place(0, 0)}>
					<div class={`${classpiece(board[0][0])}`}>{piece(board[0][0])}</div>
				</div>
				<div class={`${boardcolour(1,0)} ${square_css}`} on:click={() => place(1, 0)}>
					<div class={`${classpiece(board[0][1])}`}>{piece(board[0][1])}</div>
				</div>
				<div class={`${boardcolour(2,0)} ${square_css}`} on:click={() => place(2, 0)}>
					<div class={`${classpiece(board[0][2])}`}>{piece(board[0][2])}</div>
				</div>
			</div>
		</div>
		<div class="flex-col">
			<div class="flex">
				<div class={`bg-gray-200 ${square_css}`} on:click={() => place(0, 1)}>
					<div class={`${classpiece(board[1][0])}`}>{piece(board[1][0])}</div>
				</div>
				<div class={`bg-gray-600 ${square_css}`} on:click={() => place(1, 1)}>
					<div class={`${classpiece(board[1][1])}`}>{piece(board[1][1])}</div>
				</div>
				<div class={`bg-gray-200 ${square_css}`} on:click={() => place(2, 1)}>
					<div class={`${classpiece(board[1][2])}`}>{piece(board[1][2])}</div>
				</div>
			</div>
		</div>
		<div class="flex-col">
			<div class="flex">
				<div class={`bg-gray-600 ${square_css}`} on:click={() => place(0, 2)}>
					<div class={`${classpiece(board[2][0])}`}>{piece(board[2][0])}</div>
				</div>
				<div class={`bg-gray-200 ${square_css}`} on:click={() => place(1, 2)}>
					<div class={`${classpiece(board[2][1])}`}>{piece(board[2][1])}</div>
				</div>
				<div class={`bg-gray-600 ${square_css}`} on:click={() => place(2, 2)}>
					<div class={`${classpiece(board[2][2])}`}>{piece(board[2][2])}</div>
				</div>
			</div>
		</div>
	</board>
</div> -->


