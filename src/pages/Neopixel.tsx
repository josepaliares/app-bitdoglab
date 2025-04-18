import { useNavigate } from 'react-router-dom';
import './style.css'
import { useEffect, useRef, useState } from 'react';

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
                    (ledContainer as HTMLElement).style.border = '2px solid red';
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
        const rgbColor = `rgb(
            ${color === 'r' ? value : valueR},
            ${color === 'g' ? value : valueG},
            ${color === 'b' ? value : valueB}
        )`;

        const svg = ledSelecionado?.querySelector('svg');
        const rect = svg?.querySelector('rect');
        rect?.setAttribute('fill', rgbColor);
        rect?.setAttribute('text', 'on');
    }

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        // Cria os LEDs
        loadLed(wrapperRefs.current, 'led1');
        loadLed(wrapperRefs.current, 'led3');
        loadLed(wrapperRefs.current, 'led4');
        loadLed(wrapperRefs.current, 'led2');
        loadLed(wrapperRefs.current, 'led5');

        loadLed(wrapperRefs2.current, 'led6');
        loadLed(wrapperRefs2.current, 'led7');
        loadLed(wrapperRefs2.current, 'led8');
        loadLed(wrapperRefs2.current, 'led9');
        loadLed(wrapperRefs2.current, 'led10');

        loadLed(wrapperRefs3.current, 'led11');
        loadLed(wrapperRefs3.current, 'led12');
        loadLed(wrapperRefs3.current, 'led13');
        loadLed(wrapperRefs3.current, 'led14');
        loadLed(wrapperRefs3.current, 'led15');

        loadLed(wrapperRefs4.current, 'led16');
        loadLed(wrapperRefs4.current, 'led17');
        loadLed(wrapperRefs4.current, 'led18');
        loadLed(wrapperRefs4.current, 'led19');
        loadLed(wrapperRefs4.current, 'led20');

        loadLed(wrapperRefs5.current, 'led21');
        loadLed(wrapperRefs5.current, 'led22');
        loadLed(wrapperRefs5.current, 'led23');
        loadLed(wrapperRefs5.current, 'led24');
        loadLed(wrapperRefs5.current, 'led25');

        const limparBtn = document.getElementById("limpar");
        const enviarBtn = document.getElementById("enviar");

        limparBtn?.addEventListener("click", () => {
            const leds = document.querySelectorAll('svg #led');
            leds.forEach((led) => {
                led.setAttribute('fill', 'rgb(0, 0, 0)');
                led.setAttribute('text', 'off');
            });
        });

        enviarBtn?.addEventListener("click", () => {
            const leds = document.querySelectorAll('svg');
            const dados: any[] = [];

            leds.forEach(svg => {
                const id = svg.getAttribute('id');
                const ledRect = svg.querySelector('#led');

                if (ledRect) {
                    const cor = ledRect.getAttribute('fill');
                    const text = ledRect.getAttribute('text');
                    dados.push({ id, cor, text });
                }
            });

            const json = JSON.stringify(dados, null, 3);
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
        <><h1>Neopixel</h1>
        <h2>Selecione um dos 25 LEDS e regule a cor conforme desejar</h2>

        <div id="leds-wrapper" ref={wrapperRefs}>
            <h4 id='numberUp'>4</h4>
        </div>
        <div id="leds-wrapper2" ref={wrapperRefs2}>
            <h4 id='numberUp'>3</h4>
        </div>
        <div id="leds-wrapper3" ref={wrapperRefs3}>
            <h4 id='numberUp'>2</h4>
        </div>
        <div id="leds-wrapper4" ref={wrapperRefs4}>
            <h4 id='numberUp'>1</h4>
        </div>
        <div id="leds-wrapper5" ref={wrapperRefs5}>
            <h4 id='numberUp'>0</h4>
        </div>
        <div id="leds-wrapper6" ref={textNumbers}>
            <h5 className='textInLine'>0</h5>
            <h5 className='textInLine'>1</h5>
            <h5 className='textInLine'>2</h5>
            <h5 className='textInLine'>3</h5>
            <h5 className='textInLine'>4</h5>
        </div>

        <div className="slider-container">
            <label>R:
                <input type="range" id="rSlider" min="0" max="255" value={valueR} onChange={updateLEDColor('r')}></input>
                <span id="rValueDisplay">{valueR}</span>
            </label>
        </div>
        <div className="slider-container">
            <label>G:
                <input type="range" id="gSlider" min="0" max="255" value={valueG} onChange={updateLEDColor('g')}></input>
                <span id="gValueDisplay">{valueG}</span>
            </label>
        </div>
        <div className="slider-container">
            <label>B:
                <input type="range" id="bSlider" min="0" max="255" value={valueB} onChange={updateLEDColor('b')}></input>
                <span id="bValueDisplay">{valueB}</span>
            </label>
        </div>
        <button id="limpar">Limpar</button><button id="enviar">Enviar</button><button onClick={() => navigate('/components')}>Voltar</button>
        </>

    );
}
