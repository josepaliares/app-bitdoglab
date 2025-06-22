import { BuzzersController } from "../utils/buzzersController";

export async function playbackBuzzerSequence(
  controller: BuzzersController,
  sequence: any[]
) {
  for (const event of sequence) {
    // Espera o delay antes de cada evento
    if (event.delay !== undefined && event.delay > 0) {
      await new Promise(res => setTimeout(res, event.delay));
    }

    if (event.isPressed) {
      // Nota pressionada: toca a frequência
      await controller.startBuzzer(event.frequency);
    } else {
      // Nota solta: para a nota
      // Espera a duration antes de soltar, ou já foi esperado no evento anterior
      await controller.stopBuzzer(event.duration ?? 0);
    }
  }
}