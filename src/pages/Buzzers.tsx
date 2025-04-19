import './style.css';
import { useNavigate } from 'react-router-dom';

export default function Buzzers() {
    const navigate = useNavigate();

    return (
    <div className='h-screen flex flex-col items-center justify-center gap-3.5'>
        <h1 className='text-ubuntu font-medium text-lg'>Buzzers</h1>
        <button onClick={() => navigate('/components')}>Voltar</button>
        <button className='bigButton' onClick={() => navigate('/buzzersTocar')}>Tocar em tempo real</button>
        <button className='bigButton' onClick={() => navigate('/buzzersGravar')}>Gravar uma musica</button>
    </div>
    );
}