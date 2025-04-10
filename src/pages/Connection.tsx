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
        <h1>Conecte-se a placa para começar</h1>
    <Button>Conectar</Button>
    </div>
  );
}