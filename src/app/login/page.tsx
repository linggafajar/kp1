"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    setError("")

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Login gagal, coba lagi.")
        return
      }

      localStorage.setItem("user", JSON.stringify(data.user))

      if (data.user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login.")
      console.error(err)
    }
  }

  const goToRegister = () => {
    router.push("/signup")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-2">
          <Image src="/path/to/image.jpg" alt="desc" width={100} height={100} />

          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="identifier">Nama/email</Label>
            <Input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button className="w-full" onClick={handleLogin}>
            Masuk
          </Button>
          <Button variant="outline" className="w-full" onClick={goToRegister}>
            Daftar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
