import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Connection() {
    const navigate = useNavigate();

    return (
    <div className='h-screen flex flex-col items-center justify-center gap-3.5'>
        <h1 className='text-ubuntu px-8 font-medium text-lg'>Antes de começar, primeiro conecte-se com a placa</h1>
        <Button onClick={()=>navigate('/components')}>Conectar</Button>
    </div>
    );
}