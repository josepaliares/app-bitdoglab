import PianoKey from './PianoKey';

const BlackKey = ({ id, onClick }: { id: string; onClick?: (duration: number) => void }) => {
  return (
    <PianoKey
      id={id}
      svgPath="/assets/blackKey.svg"
      color="black"
      activeColor="#444"
      onClick={onClick}
    />
  );
};

export default BlackKey;
