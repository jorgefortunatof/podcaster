//SPA - useEffect
//SSR - getServerSideProps
//SSG - getStaticProps

export default function Home({ episodes }) {
	console.log({ episodes });
	return (
		<>
			<h1>INDEX</h1>
		</>
	);
}

export async function getStaticProps() {
	const response = await fetch("http://localhost:3333/episodes");
	const data = await response.json();

	return {
		props: {
			episodes: data,
		},
		revalidate: 60 * 60 * 6,
	};
}
