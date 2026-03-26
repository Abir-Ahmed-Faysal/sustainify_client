export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar will go here */}
      <main className="flex-grow">{children}</main>
      {/* Footer will go here */}
    </div>
  );
}
