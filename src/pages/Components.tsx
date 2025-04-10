import { Button } from '../components/ui/button';

export function Welcome() {
  return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px'
      }}>
        <h1>Qual componentes você quer explorar?</h1>
    <Button>Botões</Button>
    <Button>Buzzers</Button>
    <Button>Microfone</Button>
    <Button>Neopixel</Button>
    <Button>Display</Button>
    <Button>Joystick</Button>
    <Button>Led RGB</Button>
    </div>
  );
}