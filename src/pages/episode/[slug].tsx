import Link from "next/link";
import Image from "next/image";
import { GetStaticPaths, GetStaticProps } from "next";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import api from "../../services/api";
import styles from "./episode.module.scss";
import React from "react";
import { usePlayer } from "../../hooks/player";

interface Episode {
	id: string;
	title: string;
	members: string;
	thumbnail: string;
	duration: number;
	durationAsString: string;
	description: string;
	url: string;
	publishedAt: string;
}

interface Props {
	episode: Episode;
}

export default function Episode({ episode }: Props) {
	const { play } = usePlayer();

	return (
		<div className={styles.container}>
			<div className={styles.thumbnailContainer}>
				<Link href="/">
					<button type="button">
						<img src="/arrow-left.svg" alt="Voltar" />
					</button>
				</Link>

				<Image
					width={700}
					height={300}
					src={episode.thumbnail}
					objectFit="cover"
				/>

				<button type="button" onClick={() => play(episode)}>
					<img src="/play.svg" alt="Tocar episódio" />
				</button>
			</div>

			<header>
				<h1>{episode.title}</h1>
				<span>{episode.members}</span>
				<span>{episode.publishedAt}</span>
				<span>{episode.durationAsString}</span>
			</header>

			<div
				className={styles.description}
				dangerouslySetInnerHTML={{ __html: episode.description }}
			/>
		</div>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	const { data } = await api.get("episodes", {
		params: {
			_limit: 2,
			_sort: "published_at",
			_order: "desc",
		},
	});

	return {
		paths: data.map((item: Episode) => ({
			params: {
				slug: item.id,
			},
		})),
		fallback: "blocking",
	};
};

export const getStaticProps: GetStaticProps = async (ctx) => {
	const { slug } = ctx.params;
	const { data } = await api.get(`episodes/${slug}`);

	const episode = {
		id: data.id,
		title: data.title,
		members: data.members,
		thumbnail: data.thumbnail,
		duration: data.file.duration,
		durationAsString: convertDurationToTimeString(Number(data.file.duration)),
		url: data.file.url,
		publishedAt: format(parseISO(data.published_at), "d MMM yy", {
			locale: ptBR,
		}),
		description: data.description,
	};

	return {
		props: { episode },
		revalidate: 60 * 60 * 12,
	};
};
