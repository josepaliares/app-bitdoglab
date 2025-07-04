import { useState, useEffect, useRef } from "react";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { GameController } from "@/utils/jogoController";

export const useGame = (
	sendCommand: (command: string) => Promise<void>
) => {
	const gameController = useRef<GameController | null>(null);
	const hasInitialized = useRef(false);
	const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

	const [isGameRunning, setIsGameRunning] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Inicializa o controller uma vez só
	useEffect(() => {
		if (hasInitialized.current) return;
		hasInitialized.current = true;
		gameController.current = new GameController(sendCommand);
	}, [sendCommand]);

	// Bloqueia landscape para melhor experiência do jogo
	useEffect(() => {
		if (isGameRunning) {
			ScreenOrientation.lock({ orientation: "landscape" });
			// Start game loop
			startGameLoop();
		} else {
			// Stop game loop
			stopGameLoop();
		}

		return () => {
			ScreenOrientation.lock({ orientation: "portrait" });
			stopGameLoop();
		};
	}, [isGameRunning]);

	const startGameLoop = () => {
		if (gameLoopRef.current) return;

		gameLoopRef.current = setInterval(async () => {
			if (gameController.current && isGameRunning) {
				try {
					await gameController.current.continueGame();
				} catch (error) {
					console.error("Erro no loop do jogo:", error);
					// Don't stop the game for minor errors
				}
			}
		}, 1000); // Execute game cycle every second
	};

	const stopGameLoop = () => {
		if (gameLoopRef.current) {
			clearInterval(gameLoopRef.current);
			gameLoopRef.current = null;
		}
	};

	/**
	 * Inicia o jogo
	 */
	const startGame = async () => {
		if (!gameController.current || isGameRunning) return;

		setIsLoading(true);
		setError(null);

		try {
			await gameController.current.startGame();
			setIsGameRunning(true);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
			setError(errorMessage);
			console.error("Erro ao iniciar jogo:", err);
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Para o jogo
	 */
	const stopGame = async () => {
		if (!gameController.current || !isGameRunning) return;

		setIsLoading(true);
		setError(null);

		try {
			await gameController.current.stopGame();
			setIsGameRunning(false);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
			setError(errorMessage);
			console.error("Erro ao parar jogo:", err);
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Reseta o setup do jogo
	 */
	const resetGame = () => {
		if (gameController.current) {
			gameController.current.resetSetup();
			setIsGameRunning(false);
			setError(null);
		}
	};

	/**
	 * Obtém o status atual do jogo
	 */
	const getGameStatus = () => {
		if (!gameController.current) {
			return { isSetupDone: false, isGameRunning: false };
		}
		return gameController.current.getGameStatus();
	};

	return {
		isGameRunning,
		isLoading,
		error,
		startGame,
		stopGame,
		resetGame,
		getGameStatus,
		gameController: gameController.current
	};
};
