"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/common/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthToast } from "@/hooks/useUtilsToast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "signin" | "signup";
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { type } = props;
  const router = useRouter();
  const { showAuthToast } = useAuthToast();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const form = new FormData(event.target as HTMLFormElement);
    const email = form.get("email");
    const password = form.get("password");

    if (type === "signup") {
      const passwordConfirmation = form.get("passwordConfirmation");
      if (password !== passwordConfirmation) {
        showAuthToast({
          title: "Password mismatch",
          description: "Passwords do not match. Please try again.",
        });
        setIsLoading(false);
        return;
      }

      const body = {
        firstname: form.get("firstname"),
        lastname: form.get("lastname"),
        email,
        password,
        classe_id: Number(form.get("classe_id")),
        filiere_id: Number(form.get("filiere_id")),
        telephone: form.get("telephone") || null,
      };

      try {
        const res = await fetch(
          "https://apimycampus.odyzia.com/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        const data = await res.json();

        if (res.ok && data.success) {
          showAuthToast({
            type: "default",
            title: "réussie",
            description: "Création de compte réussie.",
          });
          router.push("/auth/login");
        } else {
          showAuthToast({
            title: "Registration failed",
            description: data?.message || "Please check your input.",
          });
        }
      } catch (err) {
        console.error(err);
        showAuthToast({
          title: "Server error",
          description: "An error occurred. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }

      return;
    }

    // LOGIN
    try {
      const res = await fetch("https://apimycampus.odyzia.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (res.ok && data.success) {
        showAuthToast({
          type: "default",
          title: "Connexion au compte réussie",
          description: `Bonjour ${data.user.firstname.toUpperCase()} 👋`,
        });

        console.log("Redirecting to dashboard...");
        localStorage.setItem("user", `${JSON.stringify(data.user)}`);
        // const classe = data.user.
        // Solution rapide : utiliser window.location pour forcer la redirection
        router.push("/dashboard")
      } else {
        showAuthToast({
          title: "Login failed",
          description: data?.message || "Invalid credentials.",
        });
      }
    } catch (err) {
      console.error(err);
      showAuthToast({
        title: "Server error",
        description: "An error occurred. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          {type === "signup" && (
            <>
              <div className="grid gap-1">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  name="firstname"
                  type="text"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  type="text"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="classe_id">Class ID</Label>
                <Input
                  id="classe_id"
                  name="classe_id"
                  type="number"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="filiere_id">Filière ID</Label>
                <Input
                  id="filiere_id"
                  name="filiere_id"
                  type="number"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="telephone">Phone (optional)</Label>
                <Input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
              required
            />
          </div>

          {type === "signup" && (
            <div className="grid gap-1">
              <Label htmlFor="passwordConfirmation">Confirm Password</Label>
              <Input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                disabled={isLoading}
                required
              />
            </div>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {type === "signin" ? "Sign In" : "Sign Up"}
          </Button>

          {type === "signin" ? (
            <p className="text-sm text-center">
              Dont have an account?{" "}
              <Link href="/auth/register" className="font-semibold">
                Sign up
              </Link>
            </p>
          ) : (
            <p className="text-sm text-center">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-semibold">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
