"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

// Botão de submit que pede confirmação antes de enviar o form (ex.: excluir).
// Fica dentro de um <form action={serverAction}> — se o usuário cancelar,
// impedimos o submit.
export function ConfirmButton({
  confirmMessage,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { confirmMessage: string }) {
  return (
    <Button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
