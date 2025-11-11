"use client"

import { SessionProvider } from "next-auth/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
// "use client"

// import { GoogleOAuthProvider } from '@react-oauth/google'

// export function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
//       {children}
//     </GoogleOAuthProvider>
//   )
// }
