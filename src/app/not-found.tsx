import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <span className="font-heading text-6xl font-bold text-primary">404</span>
      <p className="text-muted-foreground">
        Não encontramos esta página. Que tal voltar ao catálogo?
      </p>
      <Button asChild size="lg" className="font-semibold">
        <Link href="/">Ver catálogo</Link>
      </Button>
    </div>
  );
}
