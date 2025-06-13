import React, { useEffect, useRef, useState } from 'react';

// Componente PianoKey que carrega SVGs externos baseado na variante
interface PianoKeyProps {
  id: string;
  variant: 'white' | 'black';
  onPress?: () => void;      // Chamado quando tecla é pressionada
  onRelease?: (duration: number) => void; // Chamado quando tecla é solta
  style?: React.CSSProperties;
}

const PianoKey: React.FC<PianoKeyProps> = ({
  id,
  variant,
  onPress,
  onRelease,
  style
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const pressStart = useRef<number | null>(null);

  // Configurações baseadas na variante
  const keyConfig = {
    white: {
      svgPath: '/assets/whiteKey.svg',
      defaultColor: 'white',
      activeColor: '#ddd'
    },
    black: {
      svgPath: '/assets/blackKey.svg',
      defaultColor: 'black',
      activeColor: '#444'
    }
  };

  const config = keyConfig[variant];
  const isBlack = variant === 'black';

  // Carregar SVG baseado na variante
  useEffect(() => {
    fetch(config.svgPath)
      .then((res) => res.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svg = svgDoc.querySelector("svg");
        const rect = svg?.querySelector("rect");
        
        if (!svg || !rect || !containerRef.current) return;

        svg.setAttribute("id", `${variant}-key-${id}`);
        svg.classList.add("piano-key-svg");
        
        // Cor inicial
        rect.setAttribute("fill", config.defaultColor);
        
        // Adicionar estilos CSS para transições e hover
        svg.style.transition = 'all 0.075s ease';
        svg.style.cursor = 'pointer';
        
        // Aplicar classes do Tailwind baseadas na variante
        if (isBlack) {
          svg.style.width = '28px';
          svg.style.height = '72px';
          svg.style.filter = 'drop-shadow(0 4px 6px rgb(0 0 0 / 0.1))';
        } else {
          svg.style.width = '48px';
          svg.style.height = '120px';
          svg.style.filter = 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))';
        }
        
        // Limpar container e adicionar SVG
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(svg);
        svgRef.current = svg;
      })
      .catch((error) => {
        console.error(`Erro ao carregar SVG ${config.svgPath}:`, error);
      });
  }, [id, variant, config.svgPath, config.defaultColor, isBlack]);

  // Atualizar cor quando pressionado
  useEffect(() => {
    if (!svgRef.current) return;
    const rect = svgRef.current.querySelector("rect");
    if (rect) {
      rect.setAttribute("fill", isPressed ? config.activeColor : config.defaultColor);
      
      // Efeito visual adicional
      if (isPressed) {
        svgRef.current.style.transform = 'scale(0.98)';
        svgRef.current.style.filter = isBlack 
          ? 'drop-shadow(0 2px 4px rgb(0 0 0 / 0.2)) brightness(0.8)'
          : 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.2)) brightness(0.9)';
      } else {
        svgRef.current.style.transform = 'scale(1)';
        svgRef.current.style.filter = isBlack
          ? 'drop-shadow(0 4px 6px rgb(0 0 0 / 0.1))'
          : 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))';
      }
    }
  }, [isPressed, config.activeColor, config.defaultColor, isBlack]);

  const handleMouseDown = () => {
    if (isPressed) return; // Evita múltiplos eventos
    
    setIsPressed(true);
    pressStart.current = Date.now();
    
    // Chama o callback de pressionar
    if (onPress) {
      onPress();
    }
  };

  const handleMouseUp = () => {
    if (!isPressed) return; // Só executa se a tecla estava pressionada
    
    setIsPressed(false);
    const duration = pressStart.current ? Date.now() - pressStart.current : 0;
    pressStart.current = null;
    
    // Chama o callback de soltar com a duração
    if (onRelease && duration > 0) {
      onRelease(duration);
    }
  };

  const handleMouseLeave = () => {
    if (isPressed) {
      // Só processa se realmente estava pressionado
      setIsPressed(false);
      const duration = pressStart.current ? Date.now() - pressStart.current : 0;
      pressStart.current = null;
      
      // Chama o callback de soltar com a duração
      if (onRelease && duration > 0) {
        onRelease(duration);
      }
    }
  };

  return (
    <div
      className="cursor-pointer select-none relative transition-all duration-75"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      data-key-id={id}
      data-variant={variant}
      style={style}
    >
      <div ref={containerRef} />

      {/* Label da nota */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-medium pointer-events-none z-10">
        {isBlack ? (
          // Label branca para teclas pretas
          <span className="text-white drop-shadow-sm">{id}</span>
        ) : (
          // Label para teclas brancas
          <span className="text-text">{id}</span>
        )}
      </div>
    </div>
  );
};

export default PianoKey;