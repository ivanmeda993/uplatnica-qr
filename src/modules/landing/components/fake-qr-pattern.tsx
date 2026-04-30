interface FakeQrPatternProps {
  size?: number;
  seed?: number;
  className?: string;
}

export function FakeQrPattern({ size = 21, seed = 1, className }: FakeQrPatternProps) {
  const cells = Array.from({ length: size * size }, (_, i) => {
    const r = Math.sin(i * 12.9898 * seed) * 43758.5453;
    return r - Math.floor(r) > 0.55;
  });
  return (
    <div
      className={'grid h-full w-full gap-[2px] ' + (className ?? '')}
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
    >
      {cells.map((on, i) => {
        const row = Math.floor(i / size);
        const col = i % size;
        const isFinder =
          (row < 7 && col < 7) || (row < 7 && col > size - 8) || (row > size - 8 && col < 7);
        const max = size - 1;
        const isFinderRing =
          isFinder &&
          (row === 0 ||
            row === 6 ||
            col === 0 ||
            col === 6 ||
            (row > 1 && row < 5 && col > 1 && col < 5) ||
            (row > size - 8 &&
              (row === size - 7 ||
                row === max ||
                col === 0 ||
                col === 6 ||
                (row > size - 6 && row < size - 2 && col > 1 && col < 5))) ||
            (col > size - 8 &&
              (col === size - 7 ||
                col === max ||
                row === 0 ||
                row === 6 ||
                (col > size - 6 && col < size - 2 && row > 1 && row < 5))));
        const visible = isFinder ? isFinderRing : on;
        return (
          <div
            key={i}
            className={visible ? 'bg-foreground rounded-[1px]' : 'rounded-[1px] bg-transparent'}
          />
        );
      })}
    </div>
  );
}
