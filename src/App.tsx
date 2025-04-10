import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SplashScreen from './pages/SplashScreen';
import Welcome from './pages/Welcome';
import Connection from './pages/Connection';
import Components from './pages/Components';
import Botoes from './pages/Buttons';
import Buzzers from './pages/Buzzers';
import Microfone from './pages/Microphone';
import Display from './pages/Display';
import Joystick from './pages/Joystick';
import Neopixel from './pages/Neopixel';
import LedRGB from './pages/LedRGB';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/connection" element={<Connection />} />
        <Route path="/components" element={<Components />} />
        <Route path="/botoes" element={<Botoes />} />
        <Route path="/buzzers" element={<Buzzers />} />
        <Route path="/microfone" element={<Microfone />} />
        <Route path="/display" element={<Display />} />
        <Route path="/joystick" element={<Joystick />} />
        <Route path="/neopixel" element={<Neopixel />} />
        <Route path="/ledrgb" element={<LedRGB />} />
      </Routes>
    </BrowserRouter>
  );
}
