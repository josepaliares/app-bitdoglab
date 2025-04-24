import { useNavigate } from 'react-router-dom';
import './style.css'
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Neopixel() {
    const navigate = useNavigate();
    const hasRun = useRef(false);

    const wrapperRefs = useRef<HTMLDivElement>(null);
    const wrapperRefs2 = useRef<HTMLDivElement>(null);
    const wrapperRefs3 = useRef<HTMLDivElement>(null);
    const wrapperRefs4 = useRef<HTMLDivElement>(null);
    const wrapperRefs5 = useRef<HTMLDivElement>(null);
    const textNumbers = useRef<HTMLDivElement>(null);

    const [valueR, setValueR] = useState(0);
    const [valueG, setValueG] = useState(0);
    const [valueB, setValueB] = useState(0);

    const [ledSelecionado, setLedSelecionado] = useState<HTMLDivElement | null>(null);

    function loadLed(container: HTMLDivElement | null, ledId: string) {
        fetch("../src/pages/LED.svg")
            .then(res => res.text())
            .then(svgText => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
                const svg = svgDoc.querySelector('svg');
                const rect = svg?.querySelector('#led');

                if (!svg || !rect) return;

                svg.setAttribute('id', ledId);
                svg.classList.add('led-svg');

                const ledContainer = document.createElement('div');
                ledContainer.classList.add('led-container');
                ledContainer.appendChild(svg);
                
                svg.addEventListener('click', () => {
                    document.querySelectorAll('.led-container').forEach(c => {
                        (c as HTMLElement).style.border = 'none';
                    });
                    (ledContainer as HTMLElement).style.border = '4px solid #e31a8b';
                    (ledContainer as HTMLElement).style.borderRadius = '11px';
                    
                    setLedSelecionado(ledContainer);
                    painter();
                });
                
                if (container) {
                    container.appendChild(ledContainer);
                }
            });
    }

    function painter() {
        console.log("veremeio> ==", valueR)
        const rgbColor = `rgb( ${valueR}, ${valueG}, ${valueB})`;
        console.log(rgbColor);
        const svg = ledSelecionado?.querySelector('svg');
        const rect = svg?.querySelector('rect');
        rect?.setAttribute('fill', rgbColor);
        rect?.setAttribute('text', 'on');
    }

    // Atualiza a cor do LED selecionado
    const updateLEDColor = (color: 'r' | 'g' | 'b') => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
         
        if (color === 'r') {
        setValueR(value);
        } else if (color === 'g') {
        setValueG(value);
        } else if (color === 'b') {
        setValueB(value);
        }

        // calcula nova cor RGB
        const rgbColor = `rgb(${color === 'r' ? value : valueR}, ${color === 'g' ? value : valueG}, ${color === 'b' ? value : valueB})`;

        const svg = ledSelecionado?.querySelector('svg');
        const rect = svg?.querySelector('rect');
        rect?.setAttribute('fill', rgbColor);
        rect?.setAttribute('text', 'on');
    }

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        // Cria os LEDs
        loadLed(wrapperRefs.current, '24');
        loadLed(wrapperRefs.current, '23');
        loadLed(wrapperRefs.current, '22');
        loadLed(wrapperRefs.current, '21');
        loadLed(wrapperRefs.current, '20');

        loadLed(wrapperRefs2.current, '15');
        loadLed(wrapperRefs2.current, '16');
        loadLed(wrapperRefs2.current, '17');
        loadLed(wrapperRefs2.current, '18');
        loadLed(wrapperRefs2.current, '19');

        loadLed(wrapperRefs3.current, '14');
        loadLed(wrapperRefs3.current, '13');
        loadLed(wrapperRefs3.current, '12');
        loadLed(wrapperRefs3.current, '11');
        loadLed(wrapperRefs3.current, '10');

        loadLed(wrapperRefs4.current, '5');
        loadLed(wrapperRefs4.current, '6');
        loadLed(wrapperRefs4.current, '7');
        loadLed(wrapperRefs4.current, '8');
        loadLed(wrapperRefs4.current, '9');

        loadLed(wrapperRefs5.current, '4');
        loadLed(wrapperRefs5.current, '3');
        loadLed(wrapperRefs5.current, '2');
        loadLed(wrapperRefs5.current, '1');
        loadLed(wrapperRefs5.current, '0');

        const limparBtn = document.getElementById("limpar");
        const enviarBtn = document.getElementById("enviar");

        limparBtn?.addEventListener("click", () => {
            const leds = document.querySelectorAll('svg #led');
            leds.forEach((led) => {
                led.setAttribute('fill', 'rgb(60, 60, 60)');
                led.setAttribute('text', 'off');
            });
        });

        enviarBtn?.addEventListener("click", () => {
            const leds = document.querySelectorAll('svg');
            const dados: any[] = [];

            leds.forEach(svg => {
                const pos = svg.getAttribute('id');
                const ledRect = svg.querySelector('#led');

                if (ledRect) {
                    const cor = ledRect.getAttribute('fill');
                    dados.push({ pos, cor});
                }
            });

            const json = JSON.stringify({ neopixel: dados}, null, 3);
            const blob = new Blob([json], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'infoLEDs.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

    }, []);

    return (
        <>
        <div className="absolute top-5 left-5">
          <Button variant="blue" onClick={() => navigate('/components')}>
            Voltar
          </Button>
        </div>
        <h1 className="text-ubuntu font-medium text-lg mt-5">Neopixel</h1>
        <h2 className="text-ubuntu font-medium text-md mb-5">Selecione um dos 25 LEDS e regule a cor conforme desejar</h2>

        <div id="leds-wrapper" ref={wrapperRefs}>
            <h4 className="text-ubuntu font-medium text-md mt-3">4</h4>
        </div>
        <div id="leds-wrapper2" ref={wrapperRefs2}>
            <h4 className="text-ubuntu font-medium text-md mt-3">3</h4>
        </div>
        <div id="leds-wrapper3" ref={wrapperRefs3}>
            <h4 className="text-ubuntu font-medium text-md mt-3">2</h4>
        </div>
        <div id="leds-wrapper4" ref={wrapperRefs4}>
            <h4 className="text-ubuntu font-medium text-md mt-3">1</h4>
        </div>
        <div id="leds-wrapper5" ref={wrapperRefs5}>
            <h4 className="text-ubuntu font-medium text-md mt-3">0</h4>
        </div>
        <div className="flex flex-row justify-center gap-10 mb-5" ref={textNumbers}>
            <h5 className='ml-4'>0</h5>
            <h5 className='ml-3'>1</h5>
            <h5 className='ml-3'>2</h5>
            <h5 className='ml-3'>3</h5>
            <h5 className='ml-3'>4</h5>
        </div>

        <div className="slider-container">
            <label className='font-medium font-ubuntu text-md'>R:
                <input type="range" id="rSlider" min="0" max="255" value={valueR} onChange={updateLEDColor('r')}></input>
                <span id="rValueDisplay">{valueR}</span>
            </label>
        </div>
        <div className="slider-container">
            <label className='font-medium font-ubuntu text-md'>G:
                <input type="range" id="gSlider" min="0" max="255" value={valueG} onChange={updateLEDColor('g')}></input>
                <span id="gValueDisplay">{valueG}</span>
            </label>
        </div>
        <div className="slider-container">
            <label className='font-medium font-ubuntu text-md'>B:
                <input type="range" id="bSlider" min="0" max="255" value={valueB} onChange={updateLEDColor('b')}></input>
                <span id="bValueDisplay">{valueB}</span>
            </label>
        </div>
        <div className='flex flex-row justify-center gap-3 mt-3'>
            <Button variant="whitePink" id="limpar">Limpar</Button><Button id="enviar">Enviar</Button>
        </div>
        </>

    );
}
