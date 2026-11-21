export default function Skeleton({ variant = 'text', width, height, count = 1 }) {
  const base = 'skeleton-shimmer rounded';
  const styles = {
    text: { width: width || '100%', height: height || '14px', borderRadius: '4px' },
    circle: { width: width || '40px', height: height || '40px', borderRadius: '50%' },
    rect: { width: width || '100%', height: height || '100px', borderRadius: '8px' },
    card: { width: width || '100%', height: height || '120px', borderRadius: '12px' },
  };
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={base} style={styles[variant]} />
      ))}
    </div>
  );
}
