"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./AuthContext";
import { ListsProvider } from "./ListsContext";
import { BookmarksProvider } from "./BookmarksContext";
import { HistoryProvider } from "./HistoryContext";

export function Providers({
  isLoggedIn,
  children,
}: {
  isLoggedIn: boolean;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <HistoryProvider>
        <AuthProvider isLoggedIn={isLoggedIn}>
          <BookmarksProvider isLoggedIn={isLoggedIn}>
            <ListsProvider isLoggedIn={isLoggedIn}>{children}</ListsProvider>
          </BookmarksProvider>
        </AuthProvider>
      </HistoryProvider>
    </ThemeProvider>
  );
}
