import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import bitdog from "../assets/imgs/bitdog-fav-1.png";

export default function Components() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <img
        src={bitdog}
        alt="imagem BitDog"
        className="w-1/4 mb-4" // Changed from w-1/2 to w-1/4 to make it 50% smaller
      />
      <h1 className="text-ubuntu font-medium text-lg">
        Qual componente você quer explorar?
      </h1>
      <div className="flex flex-wrap justify-center gap-4 w-full max-w-md px-8">
        <Button
          className="flex-1 min-w-[calc(50%-0.5rem)]"
          onClick={() => navigate("/botoes")}
        >
          Botões
        </Button>
        <Button
          className="flex-1 min-w-[calc(50%-0.5rem)]"
          onClick={() => navigate("/buzzers")}
        >
          Buzzers
        </Button>
        <Button
          className="flex-1 min-w-[calc(50%-0.5rem)]"
          onClick={() => navigate("/microfone")}
        >
          Microfone
        </Button>
        <Button
          className="flex-1 min-w-[calc(50%-0.5rem)]"
          onClick={() => navigate("/display")}
        >
          Display
        </Button>
        <Button
          className="flex-1 min-w-[calc(50%-0.5rem)]"
          onClick={() => navigate("/joystick")}
        >
          JoyStick
        </Button>
        <Button
          className="flex-1 min-w-[calc(50%-0.5rem)]"
          onClick={() => navigate("/neopixel")}
        >
          NeoPixel
        </Button>
        <Button
          className="flex-1 min-w-[calc(50%-0.5rem)]"
          onClick={() => navigate("/ledrgb")}
        >
          Led RGB
        </Button>
      </div>
    </div>
  );
}
