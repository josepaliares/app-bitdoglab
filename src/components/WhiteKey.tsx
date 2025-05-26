import PianoKey from './PianoKey';

const WhiteKey = ({ id, onClick }: { id: string; onClick?: (duration: number) => void }) => {
  return (
    <PianoKey
      id={id}
      svgPath="/assets/whiteKey.svg"
      color="white"
      activeColor="#ddd"
      onClick={onClick}
    />
  );
};

export default WhiteKey;
