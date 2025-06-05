import PeminjamanForm from "@/components/formpeminjaman"

export default function PeminjamanPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Form Peminjaman</h1>
        <PeminjamanForm />
      </div>
    </div>
  )
}
