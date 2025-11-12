import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autenticação",
  description: "Página de autenticação",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
