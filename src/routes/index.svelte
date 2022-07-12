<script>
	import { Router, Link, Route } from 'svelte-navigator';
	import Board from '$lib/components/board.svelte';
	import About from '$lib/components/about.svelte';
	$: loc = '';

	const setLoc = (new_loc) => {
		loc = new_loc;
	};
</script>

<!-- <Router>
	<div>
		<Route path="/">
			<div>Base</div>
		</Route>
	</div>

	<div class="flex">
		<Link to="about" class="mr-3 px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-400">About</Link>
		<Link to="board" class="mr-3 px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-400">Board</Link>
	</div>
	<main>
		<div>main</div>
	<Route path="/">
		<div class="text-2xl font-bold">Default home page</div>
	</Route>
	<Route path="/about">
		<About />
	</Route>
	<Route path="/board">
		<Board />
	</Route>
</main>
</Router> -->
<div class="py-10 bg-gray-500" />
<div class="mt-1 container mx-auto">
	<div class="flex">
		<span
			on:click={() => setLoc('')}
			class="mr-3 px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-400">Home</span
		>
		<span
			on:click={() => setLoc('about')}
			class="mr-3 px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-400">About</span
		>
		<span
			on:click={() => setLoc('board')}
			class="mr-3 px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-400">Board</span
		>
	</div>
	<main>
		{#if loc === ''}
			<div class="py-2 text-3xl underline font-bold text-gray-600">Default home page</div>
		{:else if loc === 'about'}
			<About />
		{:else if loc === 'board'}
			<Board />
		{/if}
	</main>
</div>
