import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Display() {

    const navigate = useNavigate();
    
    return (
    <div className='h-screen flex flex-col items-center justify-center gap-3.5'>
        <h1 className='text-ubuntu font-medium text-lg'>Display</h1>
        <Button onClick={() => navigate('/components')}>Voltar</Button>
    </div>
  );
}