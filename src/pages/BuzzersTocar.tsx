import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import './style.css'


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
        <h3>Escolha uma nota e seu tom</h3>
        <div id="escala">
            <h5 className='textInLine'>1</h5>
            <h5 className='textInLine'>2</h5>
            <h5 className='textInLine'>3</h5>
            <h5 className='textInLine'>4</h5>
            <h5 className='textInLine'>5</h5>
            <h5 className='textInLine'>6</h5>
            <h5 className='textInLine'>7</h5>
        </div>
        <div className="slider-container">
            <label> Grave
                <input type="range" id="tomSlider" min="1" max="7" ></input>
                Agudo
            </label>
        </div>
    <Button onClick={() => navigate('/buzzers')}>Voltar</Button>
    </div>
    );
}