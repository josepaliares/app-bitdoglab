import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/welcome'); // muda para a tela de boas-vindas
        }, 2000);

        return () => clearTimeout(timer); // limpa o timer se sair da tela
    }, [navigate]);

    return (
    <div className='bg-gradient-to-bl from-pink-30 to-blue-30 h-screen flex items-center justify-center'>
        <h1 className='font-ubuntu font-xl font-bold text-white'>Escola 4.0</h1>
    </div>
    );
}