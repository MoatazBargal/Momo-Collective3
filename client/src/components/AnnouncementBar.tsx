const MESSAGES = [
  "Free shipping on all orders over 2,000 LE",
  "New Drop — Built for culture",
  "Cash on delivery across Egypt",
  "Limited quantities · Don't sleep on it",
];

export default function AnnouncementBar() {
  // Duplicate the list so the marquee loops seamlessly
  const items = [...MESSAGES, ...MESSAGES];

  return (
    <div className="marquee" role="region" aria-label="Announcements">
      <div className="marquee__track" aria-hidden="false">
        {items.map((msg, i) => (
          <span key={i} className="marquee__item">
            {msg} <span className="mx-3 opacity-60">✦</span>
          </span>
        ))}
      </div>
      <div className="marquee__track" aria-hidden="true">
        {items.map((msg, i) => (
          <span key={`dup-${i}`} className="marquee__item">
            {msg} <span className="mx-3 opacity-60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
