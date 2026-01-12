"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/server/better-auth/client";
import { api } from "@/trpc/react";

/**
 * OAuth Callback Page
 *
 * This page handles the callback after OAuth authentication.
 * If there's an invitation token in the URL, it will:
 * 1. Check if the user's email matches the invitation
 * 2. Apply the invited role to the user
 * 3. Redirect to /dashboard
 *
 * Otherwise, it redirects to the home page.
 */
export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
            <p className="text-muted-foreground mt-4">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  const inviteToken = searchParams?.get("invite");

  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const checkAndApplyRole = api.invitation.checkAndApplyRole.useMutation({
    onSuccess: (data) => {
      if (data.hadInvitation) {
        toast.success(`Welcome! You've been assigned ${data.role} privileges.`);
        router.push("/dashboard");
      } else {
        router.push("/");
      }
      setIsProcessing(false);
    },
    onError: () => {
      // If role application fails, still redirect
      router.push("/");
      setIsProcessing(false);
    },
  });

  const markInvitationUsed = api.invitation.markUsed.useMutation({
    onSuccess: () => {
      toast.success("Invitation accepted! Welcome to the team.");
      router.push("/dashboard");
      setIsProcessing(false);
    },
    onError: () => {
      // If marking fails, still redirect
      router.push("/dashboard");
      setIsProcessing(false);
    },
  });

  useEffect(() => {
    if (isSessionPending) return;

    if (!session?.user) {
      // Not authenticated, redirect to home
      router.push("/");
      return;
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    if (inviteToken && userId) {
      // Have an invite token, mark it as used
      markInvitationUsed.mutate({
        token: inviteToken,
        userId,
      });
    } else if (userEmail && userId) {
      // No invite token in URL, but check if this email has a pending invitation
      checkAndApplyRole.mutate({
        email: userEmail,
        userId,
      });
    } else {
      // No invite, just redirect
      router.push("/");
      setIsProcessing(false);
    }
  }, [session, isSessionPending, inviteToken, router]);

  if (isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-muted-foreground mt-4">
            Setting up your account...
          </p>
        </div>
      </div>
    );
  }

  return null;
}
