import { useEffect, useRef, useState } from "react";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { BuzzersController } from "../utils/buzzersController";
import type { Note } from "../types/notes";
import { noteToFrequency } from "../types/notes";

/**
 * Custom hook to manage Piano Buzzer state and control
 * @param sendCommand - Function to send commands to the device
 * @returns All necessary state and handlers for the Buzzers component
 */
export const useBuzzers = (
	sendCommand: (command: string) => Promise<void>
) => {
	const buzzersController = useRef<BuzzersController | null>(null);
	const hasInitialized = useRef(false);
	const [octave, setOctave] = useState(4);
	const [isPlaying, setIsPlaying] = useState(false);
	const startTimeRef = useRef<number | null>(null);

	// Initialize the BuzzersController once
	useEffect(() => {
		if (hasInitialized.current) return;
		hasInitialized.current = true;
		buzzersController.current = new BuzzersController(sendCommand);
	}, [sendCommand]);

	// Lock the screen orientation to landscape when the component mounts
	useEffect(() => {
		ScreenOrientation.lock({ orientation: "landscape" });
		return () => {
			// Volta para portrait ao sair
			ScreenOrientation.lock({ orientation: "portrait" });
		};
	}, []);

	/**
	 * Manipula o evento de pressionar uma tecla (onMouseDown)
	 * @param note - Nota musical pressionada
	 */
	const handleNotePress = async (note: Note) => {
		const selectedOctave = octave;
		const frequency = noteToFrequency(note, selectedOctave);
		startTimeRef.current = Date.now();
		setIsPlaying(true);

		try {
			await buzzersController.current?.startBuzzer(frequency);
		} catch (error) {
			console.error("Erro ao iniciar nota:", error);
			setIsPlaying(false);
		}
	};

	/**
	 * Manipula o evento de soltar uma tecla (onMouseUp)
	 * @param note - Nota musical que foi solta
	 */
	const handleNoteRelease = async () => {
		if (!startTimeRef.current) return;

		const duration = Date.now() - startTimeRef.current;
		setIsPlaying(false);
		startTimeRef.current = null;

		try {
			await buzzersController.current?.stopBuzzer(duration);
		} catch (error) {
			console.error("Erro ao parar nota:", error);
		}
	};

	return {
		octave,
		setOctave,
		isPlaying,
		handleNotePress,
		handleNoteRelease,
	};
};
