import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

import api from "../services/api";
import { GetStaticProps } from "next";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import styles from "./home.module.scss";
import { usePlayer } from "../hooks/player";

interface Episode {
	id: string;
	title: string;
	members: string;
	thumbnail: string;
	duration: number;
	durationAsString: string;
	url: string;
	publishedAt: string;
}

interface Props {
	latestEpisodes: Episode[];
	allEpisodes: Episode[];
}

const Home: React.FC<Props> = ({ latestEpisodes, allEpisodes }) => {
	const { playList } = usePlayer();
	const episodeList = [...latestEpisodes, ...allEpisodes];

	return (
		<div className={styles.container}>
			<Head>
				<title>Podcaster</title>
			</Head>
			<section className={styles.latestEpisodes}>
				<h2>Últimos lançamentos</h2>

				<ul>
					{latestEpisodes?.map((episode, index) => (
						<li key={episode.id}>
							<Image
								width={192}
								height={192}
								src={episode.thumbnail}
								alt={episode.title}
								objectFit="cover"
							/>

							<div className={styles.episodeDetails}>
								<Link href={`/episode/${episode.id}`}>
									<a>{episode.title}</a>
								</Link>
								<p>{episode.members}</p>

								<span>{episode.publishedAt}</span>
								<span>{episode.durationAsString}</span>
							</div>

							<button
								type="button"
								onClick={() => playList(episodeList, index)}
							>
								<img src="/play-green.svg" alt="Tocar episódio" />
							</button>
						</li>
					))}
				</ul>
			</section>

			<section className={styles.allEpisodes}>
				<h2>Todos episódios</h2>

				<table cellSpacing={0}>
					<thead>
						<th></th>
						<th>Podcast</th>
						<th>Integrantes</th>
						<th>Data</th>
						<th>Duração</th>
						<th></th>
					</thead>
					<tbody>
						{allEpisodes.map((episode, index) => (
							<tr key={episode.id}>
								<td style={{ width: 72 }}>
									<Image
										width={120}
										height={120}
										src={episode.thumbnail}
										alt={episode.title}
										objectFit="cover"
									/>
								</td>
								<td>
									<Link href={`/episode/${episode.id}`}>
										<a>{episode.title}</a>
									</Link>{" "}
								</td>
								<td>{episode.members}</td>
								<td style={{ width: 100 }}>{episode.publishedAt}</td>
								<td>{episode.durationAsString}</td>
								<td>
									<button
										type="button"
										onClick={() =>
											playList(episodeList, index + latestEpisodes.length)
										}
									>
										<img src="/play-green.svg" alt="Tocar episódio" />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
		</div>
	);
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
	const { data } = await api.get("episodes", {
		params: {
			_limit: 12,
			_sort: "published_at",
			_order: "desc",
		},
	});

	const episodes = data.map((episode) => {
		return {
			id: episode.id,
			title: episode.title,
			members: episode.members,
			thumbnail: episode.thumbnail,
			duration: episode.file.duration,
			durationAsString: convertDurationToTimeString(
				Number(episode.file.duration)
			),
			url: episode.file.url,
			publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
				locale: ptBR,
			}),
		};
	});

	return {
		props: {
			allEpisodes: episodes.slice(2),
			latestEpisodes: episodes.slice(0, 2),
		},
		revalidate: 60 * 60 * 6,
	};
};
