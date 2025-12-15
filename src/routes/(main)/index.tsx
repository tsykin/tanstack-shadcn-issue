import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(main)/')({
	component: Page,
	loader: async () => {},
});

function Page() {
	const sections = ['overview', 'mission', 'values', 'contact'];

	return (
		<div className="mx-auto max-w-6xl p-4">
			{sections.map((id) => (
				<div key={id} className="max-w-2xs py-30" id={id}>
					<h2>{id}</h2>
					<p>
						Lorem ipsum dolor sit, amet consectetur adipisicing elit. Commodi,
						inventore aliquid! Maxime quis aliquam animi ipsum, repellendus eos
						dolorum nostrum.
					</p>
				</div>
			))}
		</div>
	);
}
