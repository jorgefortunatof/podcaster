import { useCallback, useEffect, useRef, useState } from "react";

import Image from "next/image";
import { usePlayer } from "../../hooks/player";
import styles from "./styles.module.scss";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export const Player: React.FC = () => {
	const AudioRef = useRef<HTMLAudioElement>();
	const [progress, setProgress] = useState(0);

	const {
		episodeList,
		currentEpisode,
		isPlaying,
		isLooping,
		isShuffling,
		hasNext,
		hasPrevious,
		togglePlay,
		toggleLoop,
		toggleShuffle,
		setPlayingState,
		playNext,
		playPrevious,
		clearPlayerState,
	} = usePlayer();

	useEffect(() => {
		if (isPlaying) {
			AudioRef.current?.play();
		} else {
			AudioRef.current?.pause();
		}
	}, [isPlaying]);

	const setupProgressListener = useCallback(() => {
		AudioRef.current.currentTime = 0;

		AudioRef.current.addEventListener("timeupdate", () => {
			setProgress(Math.floor(AudioRef.current.currentTime));
		});
	}, [AudioRef]);

	const handleSeek = useCallback(
		(amount: number) => {
			AudioRef.current.currentTime = amount;
			setProgress(amount);
		},
		[AudioRef]
	);

	const handleEpisodeEnded = useCallback(() => {
		if (hasNext) {
			playNext();
		} else {
			clearPlayerState();
		}
	}, [hasNext, playNext]);

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
					<span>{convertDurationToTimeString(progress)}</span>
					<div className={styles.slider}>
						{currentEpisode ? (
							<Slider
								trackStyle={{ backgroundColor: "#04d361" }}
								railStyle={{ backgroundColor: "#9f75ff" }}
								handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
								max={currentEpisode.duration}
								value={progress}
								onChange={handleSeek}
							/>
						) : (
							<div className={styles.emptySlider} />
						)}
					</div>
					<span>
						{convertDurationToTimeString(currentEpisode?.duration ?? 0)}
					</span>
				</div>

				{currentEpisode && (
					<audio
						ref={AudioRef}
						src={currentEpisode.url}
						onPlay={() => setPlayingState(true)}
						onPause={() => setPlayingState(false)}
						onEnded={handleEpisodeEnded}
						onLoadedData={setupProgressListener}
						loop={isLooping}
						autoPlay
					/>
				)}

				<div className={styles.buttons}>
					<button
						type="button"
						disabled={!currentEpisode || episodeList.length === 1}
						onClick={toggleShuffle}
						className={isShuffling && styles.isActive}
					>
						<img src="/shuffle.svg" alt="Embaralhar" />
					</button>
					<button
						type="button"
						disabled={!currentEpisode || !hasPrevious}
						onClick={playPrevious}
					>
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
					<button
						type="button"
						disabled={!currentEpisode || !hasNext}
						onClick={playNext}
					>
						<img src="/play-next.svg" alt="Tocar proxímo" />
					</button>
					<button
						type="button"
						disabled={!currentEpisode}
						onClick={toggleLoop}
						className={isLooping && styles.isActive}
					>
						<img src="/repeat.svg" alt="Repetir" />
					</button>
				</div>
			</footer>
		</div>
	);
};
