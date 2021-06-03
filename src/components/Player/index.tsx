import Image from "next/image";
import { usePlayer } from "../../hooks/player";
import styles from "./styles.module.scss";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export function Player() {
	const { currentEpisode, isPlaying, togglePlay } = usePlayer();

	return (
		<div className={styles.container}>
			<header>
				<img src="/playing.svg" alt="Tocando agora" />
				<strong>Tocando agora</strong>
			</header>

			{currentEpisode ? (
				<div className={styles.currentEpisode}>
					<Image
						width={592}
						height={592}
						src={currentEpisode.thumbnail}
						objectFit="cover"
					/>
					<strong>{currentEpisode.title}</strong>
				</div>
			) : (
				<div className={styles.emptyPlayer}>
					<strong>Selecione um podcast para ouvir</strong>
				</div>
			)}

			<footer className={!currentEpisode && styles.empty}>
				<div className={styles.progress}>
					<span>00:00</span>
					<div className={styles.slider}>
						{currentEpisode ? (
							<Slider
								trackStyle={{ backgroundColor: "#04d361" }}
								railStyle={{ backgroundColor: "#9f75ff" }}
								handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
							/>
						) : (
							<div className={styles.emptySlider} />
						)}
					</div>
					<span>00:00</span>
				</div>

				{currentEpisode && <audio src={currentEpisode.url} autoPlay />}

				<div className={styles.buttons}>
					<button type="button" disabled={!currentEpisode}>
						<img src="/shuffle.svg" alt="Embaralhar" />
					</button>
					<button type="button" disabled={!currentEpisode}>
						<img src="/play-previous.svg" alt="Tocar anterior" />
					</button>
					<button
						type="button"
						className={styles.playButton}
						disabled={!currentEpisode}
						onClick={togglePlay}
					>
						{isPlaying ? (
							<img src="/pause.svg" alt="Tocar" />
						) : (
							<img src="/play.svg" alt="Tocar" />
						)}
					</button>
					<button type="button" disabled={!currentEpisode}>
						<img src="/play-next.svg" alt="Tocar proxímo" />
					</button>
					<button type="button" disabled={!currentEpisode}>
						<img src="/repeat.svg" alt="Repetir" />
					</button>
				</div>
			</footer>
		</div>
	);
}
