import React from "react";
import { Header } from "../components/Header";
import { Player } from "../components/Player";
import { PlayerProvider } from "../hooks/player";

import styles from "../styles/app.module.scss";
import "../styles/global.scss";

function MyApp({ Component, pageProps }) {
	return (
		<PlayerProvider>
			<div className={styles.wrapper}>
				<main>
					<Header />
					<Component {...pageProps} />
				</main>
				<Player />
			</div>
		</PlayerProvider>
	);
}

export default MyApp;
