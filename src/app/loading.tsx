export default function Loading() {
  return (
    <div
      className="container page-section"
      role="status"
      aria-label="Loading / جارٍ التحميل"
    >
      <div className="skeleton heading-skeleton" />
      <div className="product-grid">
        {Array.from({ length: 4 }, (_, i) => (
          <div className="skeleton card-skeleton" key={i} />
        ))}
      </div>
    </div>
  );
}
