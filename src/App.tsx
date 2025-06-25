import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConnectionProvider } from "./contexts/ConnectionContext";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { useEffect } from "react";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { BackButtonHandler } from "./components/BackButtonHandler";

// Importações das páginas
import SplashScreen from "./pages/SplashScreen";
import Welcome from "./pages/Welcome";
import Connection from "./pages/Connection";
import Components from "./pages/Components";
import NotFound from "./pages/NotFound";

// Componentes

import Botoes from "./pages/Buttons/Buttons";
import BotoesInfo from "./pages/Buttons/ButtonsFluxograma";

import BuzzersTocar from "./pages/Buzzers/BuzzersTocar";
import BuzzersInfo from "./pages/Buzzers/BuzzersFluxograma";
import BuzzersTocarInfo1 from "./pages/Buzzers/BuzzersTocarInfo1";
import BuzzersTocarInfo2 from "./pages/Buzzers/BuzzersTocarInfo2";
import BuzzersTocarInfo3 from "./pages/Buzzers/BuzzersTocarInfo3";
import BuzzersTocarInfo4 from "./pages/Buzzers/BuzzersTocarInfo4";
import BuzzersTocarInfo5 from "./pages/Buzzers/BuzzersTocarInfo5";
import Microfone from "./pages/Microphone/Microphone";
import Display from "./pages/Display/Display";
import Joystick from "./pages/Joystick/Joystick";

import Neopixel from "./pages/Neopixel/Neopixel";
import NeopixelInfo from "./pages/Neopixel/NeopixelFluxograma";
import NeopixelInfo1 from "./pages/Neopixel/NeopixelInfo1";
import NeopixelInfo2 from "./pages/Neopixel/NeopixelInfo2";
import NeopixelInfo3 from "./pages/Neopixel/NeopixelInfo3";
import NeopixelInfo4 from "./pages/Neopixel/NeopixelInfo4";
import RGBInfo from "./pages/Neopixel/RGBInfo";

import LedRGB from "./pages/LedRGB/LedRGB";
import LedRGBInfo from "./pages/LedRGB/LedRGBFluxograma";
import LedRGBInfo1 from "./pages/LedRGB/LedRGBInfo1";
import LedRGBInfo2 from "./pages/LedRGB/LedRGBInfo2";
import LedRGBInfo4 from "./pages/LedRGB/LedRGBInfo4";
//import EmConstrucao from "./pages/EmConstrucao";

export function App() {
  useEffect(() => {
    ScreenOrientation.lock({ orientation: "portrait" });
  }, []);

  return (
    <ConnectionProvider>
      <BrowserRouter>
        <BackButtonHandler />
        <ConnectionStatus />
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/connection" element={<Connection />} />

          {/* Rota pai apenas para organização (não renderiza conteúdo) */}
          <Route path="/components">
            <Route index element={<Components />} />

            <Route path="botoes">
              <Route index element={<Botoes />} />
              <Route path="info" element={<BotoesInfo />} />
            </Route>

              <Route path="tocar">
                <Route index element={<BuzzersTocar />}/>
                <Route path="info" element={<BuzzersInfo />} />
                <Route path="info1" element={<BuzzersTocarInfo1 />} />
                <Route path="info2" element={<BuzzersTocarInfo2 />} />
                <Route path="info3" element={<BuzzersTocarInfo3 />} />
                <Route path="info4" element={<BuzzersTocarInfo4 />} />
                <Route path="info5" element={<BuzzersTocarInfo5 />} />
              </Route>
            </Route>
            
            <Route path="microfone" element={<Microfone />} />
            <Route path="display" element={<Display />} />
            <Route path="joystick" element={<Joystick />} />


            <Route path="neopixel">
              <Route index element={<Neopixel />} />
              <Route path="info" element={<NeopixelInfo />} />
              <Route path="info1" element={<NeopixelInfo1 />} />
              <Route path="info2" element={<NeopixelInfo2 />} />
              <Route path="info3" element={<NeopixelInfo3 />} />
              <Route path="info4" element={<NeopixelInfo4 />} />
              <Route path="rgb-info" element={<RGBInfo />} />
            </Route>

            <Route path="ledrgb">
              <Route index element={<LedRGB />} />
              <Route path="info" element={<LedRGBInfo />} />
              <Route path="info1" element={<LedRGBInfo1 />} />
              <Route path="info2" element={<LedRGBInfo2 />} />
              <Route path="info3" element={<NeopixelInfo3 />} />
              <Route path="info4" element={<LedRGBInfo4 />} />
              <Route path="rgb-info" element={<RGBInfo />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ConnectionProvider>
  );
}
