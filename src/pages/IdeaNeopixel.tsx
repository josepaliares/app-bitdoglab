import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import lampada from "../assets/imgs/lampada.png";
import bluetooth from "../assets/imgs/bluetooth.png";
import touch from "../assets/imgs/touch.png";
import LED from "../pages/LED.svg";

export default function IdeaNeopixel() {
    const navigate = useNavigate();
    return (
    <>
      <div className="absolute top-5 left-5">
        <Button variant="blue" onClick={() => navigate("/neopixel")}>
          Voltar
        </Button>
      </div>
  
      <div className="h-screen flex flex-col items-center justify-center gap-3.5">
        <img
          src={lampada}
          alt="imagem lampada"
          className="w-1/10 mb-4" // Changed from w-1/2 to w-1/4 to make it 50% smaller
        />
        <h1 className="text-ubuntu font-medium text-lg">Como funciona?</h1>
        <div className="flex items-center p-4 border-2 border-gray-300 rounded-lg shadow-md">
          {/* Imagem à esquerda */}
          <img 
            src={LED}
            alt="imagem LED" 
            className="w-1/6 h-auto mr-4" 
          />
          <p className="font-medium font-ubuntu text-md">
            Selecione um led
          </p>
        </div>
        <div className="flex items-center p-4 border-2 border-gray-300 rounded-lg shadow-md">
          {/* Imagem à esquerda */}
          <img 
            src={touch}
            alt="imagem touch" 
            className="w-1/6 h-auto mr-4" 
          />
          <p className="font-medium font-ubuntu text-md">
            Selecione uma cor
          </p>
        </div>
        <div className="flex items-center p-4 border-2 border-gray-300 rounded-lg shadow-md">
          {/* Imagem à esquerda */}
          <img 
            src={bluetooth}
            alt="imagem bluetooth" 
            className="w-1/6 h-auto mr-4" 
          />
          <p className="font-medium font-ubuntu text-md">
            Placa recebe via Bluetooth
          </p>
        </div>


      </div>
    </>
    );
}