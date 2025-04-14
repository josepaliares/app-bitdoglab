import './style.css';
import { useNavigate } from 'react-router-dom';

export default function Buzzers() {
    const navigate = useNavigate();

    return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px'
        }}>
        <h1>Buzzers</h1>
    <button onClick={() => navigate('/components')}>Voltar</button>
    <button className='bigButton' onClick={() => navigate('/buzzersTocar')}>Tocar em tempo real</button>
    <button className='bigButton' onClick={() => navigate('/buzzersGravar')}>Gravar uma musica</button>
    </div>
    );
}