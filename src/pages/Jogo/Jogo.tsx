import { useConnection } from "@/contexts/ConnectionContext";
import { Header } from "@/components/Header";
import { useGame } from "@/hooks/useJogo";
import { Button } from "@/components/ui/button";
import { Play, Square, RotateCcw } from "lucide-react";

export default function Game() {
	const { sendCommand } = useConnection();
	const {
		isGameRunning,
		isLoading,
		error,
		startGame,
		stopGame,
		resetGame,
		getGameStatus
	} = useGame(sendCommand);

	const status = getGameStatus();

	return (
		<div className="flex flex-col h-screen">
			<Header
				title="Jogo Interativo"
				showIdeaButton={true}
				ideaButtonPath="/components/game/info"
			/>
			<div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 bg-background">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-text mb-2">
						Jogo de Controle Interativo
					</h2>
					<p className="text-text/70 mb-4">
						Use os botões e joystick para jogar!
					</p>

					{error && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
							{error}
						</div>
					)}

					<div className="flex flex-col gap-2 text-sm text-text/60 mb-6">
						<p>Setup: {status.isSetupDone ? "✅ Pronto" : "❌ Não configurado"}</p>
						<p>Status: {isGameRunning ? "🎮 Rodando" : "⏹️ Parado"}</p>
					</div>
				</div>

				<div className="flex gap-4">
					<Button
						onClick={startGame}
						disabled={isLoading || isGameRunning}
						className="flex items-center gap-2"
					>
						<Play size={20} />
						{isLoading ? "Carregando..." : "Iniciar Jogo"}
					</Button>

					<Button
						onClick={stopGame}
						disabled={isLoading || !isGameRunning}
						variant="destructive"
						className="flex items-center gap-2"
					>
						<Square size={20} />
						Parar Jogo
					</Button>

					<Button
						onClick={resetGame}
						disabled={isLoading}
						variant="outline"
						className="flex items-center gap-2"
					>
						<RotateCcw size={20} />
						Reset
					</Button>
				</div>

				{isGameRunning && (
					<div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
						<p className="text-green-800 font-medium">
							🎮 Jogo rodando! Use o hardware para jogar.
						</p>
						<p className="text-green-600 text-sm mt-1">
							Botão A/B, Joystick e Microfone estão ativos.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
