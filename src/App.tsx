import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConnectionProvider } from "./contexts/ConnectionContext";
import { ConnectionStatus } from "./components/ConnectionStatus";
import './pages/style.css'

// Importações das páginas
import SplashScreen from "./pages/SplashScreen";
import Welcome from "./pages/Welcome";
import Connection from "./pages/Connection";
import Components from "./pages/Components";
import NotFound from "./pages/NotFound";

// Componentes
import Botoes from "./pages/Buttons/Buttons";
import Buzzers from "./pages/Buzzers/Buzzers";
import BuzzersGravar from "./pages/Buzzers/BuzzersGravar";
import BuzzersTocar from "./pages/Buzzers/BuzzersTocar";
import Microfone from "./pages/Microphone/Microphone";
import Display from "./pages/Display/Display";
import Joystick from "./pages/Joystick/Joystick";
import Neopixel from "./pages/Neopixel/Neopixel";
import NeopixelInfo from "./pages/Neopixel/NeopixelInfo";
import RGBInfo from "./pages/Neopixel/RGBInfo";
import LedRGB from "./pages/LedRGB/LedRGB";
import LedRGBInfo from "./pages/LedRGB/LedRGBInfo";

export function App() {
  return (
    <ConnectionProvider>
      <BrowserRouter>
        <ConnectionStatus />
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/connection" element={<Connection />} />
          
          {/* Rota pai apenas para organização (não renderiza conteúdo) */}
          <Route path="/components">
            <Route index element={<Components />} />
            <Route path="botoes" element={<Botoes />} />
            
            <Route path="buzzers">
              <Route index element={<Buzzers />} />
              <Route path="buzzersGravar" element={<BuzzersGravar />} />
              <Route path="buzzersTocar" element={<BuzzersTocar />} />
            </Route>
            
            <Route path="microfone" element={<Microfone />} />
            <Route path="display" element={<Display />} />
            <Route path="joystick" element={<Joystick />} />
            
            <Route path="neopixel">
              <Route index element={<Neopixel />} />
              <Route path="info" element={<NeopixelInfo />} />
              <Route path="rgb-info" element={<RGBInfo />} />
            </Route>
            
            <Route path="ledrgb">
              <Route index element={<LedRGB />} />
              <Route path="info" element={<LedRGBInfo />} />
              <Route path="rgb-info" element={<RGBInfo />} />
            </Route>
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ConnectionProvider>
  );
}