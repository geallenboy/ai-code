import React from "react";
import { AuthViewType } from "@/lib/auth";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { SupabaseClient } from "@supabase/supabase-js";
import AuthForm from "./auth-form";

export default function authDialog({
  open,
  setOpen,
  supabase,
  view
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  supabase: SupabaseClient;
  view: AuthViewType;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <VisuallyHidden>
          <DialogTitle>登录 CodeCapsule</DialogTitle>
        </VisuallyHidden>
        <AuthForm supabase={supabase} view={view} />
      </DialogContent>
    </Dialog>
  );
}
