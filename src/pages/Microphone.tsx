import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Microphone() {
    const navigate = useNavigate();
    return (
        <div className='h-screen flex flex-col items-center justify-center gap-3.5'>
            <h1 className='text-ubuntu font-medium text-lg'>Microfone</h1>
            <Button onClick={() => navigate('/components')}>Voltar</Button>
        </div>
    );
}