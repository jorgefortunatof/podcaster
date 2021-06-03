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
	play: (episode: Episode) => void;
}

const PlayerContext = createContext<PlayerContextData>({} as PlayerContextData);

const PlayerProvider: React.FC = ({ children }) => {
	const [episodeList, setEpisodeList] = useState<Episode[]>([]);
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number>(0);

	const play = useCallback(
		(episode: Episode) => {
			setEpisodeList([episode]);
			setCurrentEpisodeIndex(0);
		},
		[setCurrentEpisodeIndex, setEpisodeList]
	);

	return (
		<PlayerContext.Provider
			value={{
				episodeList,
				currentEpisodeIndex,
				currentEpisode: episodeList[currentEpisodeIndex],
				play,
			}}
		>
			{children}
		</PlayerContext.Provider>
	);
};

function usePlayer(): PlayerContextData {
	const context = useContext(PlayerContext);

	if (!context) {
		throw new Error("usePlayer deve ser passado dentro de um provider");
	}

	return context;
}

export { PlayerProvider, usePlayer };
