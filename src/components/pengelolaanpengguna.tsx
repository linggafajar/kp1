'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
}

export default function AdminPenggunaPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ id: 0, name: '', username: '', email: '', password: '', role: 'user' });
  const [isEdit, setIsEdit] = useState(false);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch(isEdit ? `/api/users/${form.id}` : '/api/users', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setIsOpen(false);
      setForm({ id: 0, name: '', username: '', email: '', password: '', role: 'user' });
      setIsEdit(false);
      fetchUsers();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin hapus pengguna ini?')) return;
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  const openEdit = (user: User) => {
    setForm({ ...user, password: '' }); // Kosongkan password saat edit
    setIsEdit(true);
    setIsOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kelola Pengguna</h1>
      <Button onClick={() => { setIsOpen(true); setIsEdit(false); }}>+ Tambah Pengguna</Button>

      <table className="w-full mt-6 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Nama</th>
            <th className="p-2 text-left">Username</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.username}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2 flex gap-2">
                <Button onClick={() => openEdit(user)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(user.id)}>Hapus</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>{isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}</DialogHeader>
          <div className="space-y-2">
            <div>
              <Label>Nama</Label>
              <Input name="name" value={form.name} onChange={handleChange} />
            </div>
            <div>
              <Label>Username</Label>
              <Input name="username" value={form.username} onChange={handleChange} />
            </div>
            <div>
              <Label>Email</Label>
              <Input name="email" value={form.email} onChange={handleChange} />
            </div>
            {!isEdit && (
              <div>
                <Label>Password</Label>
                <Input name="password" type="password" value={form.password} onChange={handleChange} />
              </div>
            )}
            <div>
              <Label>Role</Label>
              <Input name="role" value={form.role} onChange={handleChange} />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleSubmit}>{isEdit ? 'Update' : 'Simpan'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
