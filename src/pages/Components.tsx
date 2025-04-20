import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Components() {
    const navigate = useNavigate();

    return (
    <div className='h-screen flex flex-col items-center justify-center gap-4'>
        <h1 className='text-ubuntu font-medium text-lg'>Qual componentes você quer explorar?</h1>
        <Button onClick={()=>navigate('/botoes')}>Botões</Button>
        <Button onClick={()=>navigate('/buzzers')}>Buzzers</Button>
        <Button onClick={()=>navigate('/microfone')}>Microfone</Button>
        <Button onClick={()=>navigate('/display')}>Display</Button>
        <Button onClick={()=>navigate('/joystick')}>JoyStick</Button>
        <Button onClick={()=>navigate('/neopixel')}>NeoPixel</Button>
        <Button onClick={()=>navigate('/ledrgb')}>Led RGB</Button>
    </div>
    );
}