import { createContext, useCallback, useState, useContext } from "react";

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
	play: (episode: Episode) => void;
	togglePlay: () => void;
	setPlayingState: (state: boolean) => void;
}

const PlayerContext = createContext<PlayerContextData>({} as PlayerContextData);

const PlayerProvider: React.FC = ({ children }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [episodeList, setEpisodeList] = useState<Episode[]>([]);
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number>(0);

	const play = useCallback(
		(episode: Episode) => {
			setEpisodeList([episode]);
			setCurrentEpisodeIndex(0);
			setIsPlaying(true);
		},
		[setCurrentEpisodeIndex, setEpisodeList, setIsPlaying]
	);

	const togglePlay = useCallback(() => {
		setIsPlaying(!isPlaying);
	}, [setIsPlaying, isPlaying]);

	const setPlayingState = useCallback(
		(state: boolean) => {
			setIsPlaying(state);
		},
		[setIsPlaying]
	);

	return (
		<PlayerContext.Provider
			value={{
				episodeList,
				currentEpisodeIndex,
				currentEpisode: episodeList[currentEpisodeIndex],
				isPlaying,
				play,
				togglePlay,
				setPlayingState,
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
