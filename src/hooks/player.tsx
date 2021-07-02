import {
	createContext,
	useCallback,
	useState,
	useContext,
	useEffect,
} from "react";

interface Episode {
	title: string;
	members: string;
	thumbnail: string;
	duration: number;
	url: string;
}

interface PlayerContextData {
	currentEpisode: Episode;
	episodeList: Episode[];
	currentEpisodeIndex: number;

	isPlaying: boolean;
	isLooping: boolean;
	isShuffling: boolean;
	togglePlay: () => void;
	toggleLoop: () => void;
	toggleShuffle: () => void;

	hasNext: boolean;
	hasPrevious: boolean;

	play: (episode: Episode) => void;
	playList: (list: Episode[], index: number) => void;
	playNext: () => void;
	playPrevious: () => void;
	setPlayingState: (state: boolean) => void;
	clearPlayerState: () => void;
}

const PlayerContext = createContext<PlayerContextData>({} as PlayerContextData);

const PlayerProvider: React.FC = ({ children }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLooping, setIsLooping] = useState(false);
	const [isShuffling, setIsShuffling] = useState(false);

	const [episodeList, setEpisodeList] = useState<Episode[]>([]);

	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number>(0);
	const [hasNext, setHasNext] = useState(false);
	const [hasPrevious, setHasPrevious] = useState(false);

	useEffect(() => {
		setHasNext(isShuffling || currentEpisodeIndex + 1 < episodeList.length);
		setHasPrevious(currentEpisodeIndex - 1 >= 0);
	}, [currentEpisodeIndex, episodeList, isShuffling]);

	const play = useCallback(
		(episode: Episode) => {
			setEpisodeList([episode]);
			setCurrentEpisodeIndex(0);
			setIsPlaying(true);
		},
		[setCurrentEpisodeIndex, setEpisodeList, setIsPlaying]
	);

	const playList = useCallback((list: Episode[], index: number) => {
		setEpisodeList(list);
		setCurrentEpisodeIndex(index);
		setIsPlaying(true);
	}, []);

	const playNext = useCallback(() => {
		if (isShuffling) {
			const max = episodeList.length - 1;
			const randomIndex = Math.floor(Math.random() * max);

			setCurrentEpisodeIndex(randomIndex);
		} else if (hasNext) {
			setCurrentEpisodeIndex(currentEpisodeIndex + 1);
		}
	}, [currentEpisodeIndex, hasNext]);

	const playPrevious = useCallback(() => {
		if (!hasPrevious) return;

		setCurrentEpisodeIndex(currentEpisodeIndex - 1);
	}, [currentEpisodeIndex, hasPrevious]);

	const togglePlay = useCallback(() => {
		setIsPlaying(!isPlaying);
	}, [isPlaying]);

	const toggleLoop = useCallback(() => {
		setIsLooping(!isLooping);
	}, [isLooping]);

	const toggleShuffle = useCallback(() => {
		setIsShuffling(!isShuffling);
	}, [isShuffling]);

	const setPlayingState = useCallback(
		(state: boolean) => {
			setIsPlaying(state);
		},
		[setIsPlaying]
	);

	const clearPlayerState = useCallback(() => {
		setEpisodeList([]);
		setCurrentEpisodeIndex(0);
	}, []);

	return (
		<PlayerContext.Provider
			value={{
				episodeList,
				currentEpisodeIndex,
				currentEpisode: episodeList[currentEpisodeIndex],
				isPlaying,
				isLooping,
				isShuffling,
				hasNext,
				hasPrevious,
				play,
				playList,
				togglePlay,
				toggleLoop,
				toggleShuffle,
				playNext,
				playPrevious,
				setPlayingState,
				clearPlayerState,
			}}
		>
			{children}
		</PlayerContext.Provider>
	);
};

function usePlayer(): PlayerContextData {
	const context = useContext<PlayerContextData>(PlayerContext);

	if (!context) {
		throw new Error("usePlayer deve ser passado dentro de um provider");
	}

	return context;
}

export { PlayerProvider, usePlayer };
