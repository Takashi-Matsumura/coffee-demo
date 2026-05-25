export default function DiagnoseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12 md:py-16">
      {children}
    </main>
  );
}
