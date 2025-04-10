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
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px'
        }}>
        <h1>SplashScreen</h1>
    </div>

    );
}