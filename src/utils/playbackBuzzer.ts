import { BuzzersController } from "../utils/buzzersController";

export async function playbackBuzzerSequence(
  controller: BuzzersController,
  sequence: any[]
) {
  console.log("🎼 Iniciando reprodução da sequência gravada:", sequence.length, "eventos");
  
  for (let i = 0; i < sequence.length; i++) {
    const event = sequence[i];
    
    console.log(`📝 Evento ${i + 1}/${sequence.length}:`, event);

    // Espera o delay antes de cada evento
    if (event.delay !== undefined && event.delay > 0) {
      console.log(`⏳ Aguardando ${event.delay}ms`);
      await new Promise(res => setTimeout(res, event.delay));
    }

    if (event.isPressed && event.frequency) {
      // Nota pressionada: toca a frequência
      console.log(`🎵 Reproduzindo nota: ${event.note || 'desconhecida'} - ${event.frequency}Hz`);
      await controller.startBuzzer(event.frequency);
    } else if (!event.isPressed) {
      // Nota solta: para a nota
      console.log(`🔇 Parando nota: ${event.note || 'desconhecida'} - Duração: ${event.duration || 0}ms`);
      await controller.stopBuzzer(event.duration || 0);
      
      // Pequeno delay entre as transições para evitar conflitos BLE
      await new Promise(res => setTimeout(res, 50));
    }
  }
  
  // Garantir que o buzzer está parado no final
  console.log("🎼 Reprodução finalizada - garantindo que buzzer está parado");
  await controller.stopBuzzer(0);
}