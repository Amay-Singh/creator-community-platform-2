export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-1/4 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[150px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-secondary-purple/8 blur-[150px]" />
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
