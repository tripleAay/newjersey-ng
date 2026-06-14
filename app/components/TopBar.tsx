export default function TopBar() {
  const items = [
    "Custom Printing",
    "Branding",
    "Apparel",
    "Merchandise",
    "Nationwide Delivery",
  ];

  return (
    <div className="h-9 bg-black text-white">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-center">
        <div className="flex items-center gap-5 text-[12px] font-medium uppercase tracking-wider">
          {items.map((item, index) => (
            <div key={item} className="flex items-center gap-5">
              <span>{item}</span>

              {index !== items.length - 1 && (
                <span className="text-orange-500">•</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}