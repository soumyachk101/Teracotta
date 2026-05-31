import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Plus, Edit3, Trash2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Modal from '../components/ui/Modal';
import { addressSchema } from '../utils/validators';

const emptyForm = { fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false };

export default function Addresses() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => api.get('/addresses').then((r) => r.data.data),
    enabled: isAuthenticated,
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (editingId) return api.put(`/addresses/${editingId}`, data);
      return api.post('/addresses', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      setErrors({});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/addresses/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  });

  const defaultMutation = useMutation({
    mutationFn: (id) => api.put(`/addresses/${id}`, { isDefault: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  });

  if (authLoading) return <div className="section"><div className="container flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-500" /></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const handleEdit = (addr) => {
    setForm({ fullName: addr.fullName, phone: addr.phone, line1: addr.line1, line2: addr.line2 || '', city: addr.city, state: addr.state, pincode: addr.pincode, isDefault: addr.isDefault });
    setEditingId(addr.id);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = addressSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => { fieldErrors[err.path[0]] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    saveMutation.mutate(form);
  };

  return (
    <div className="section">
      <div className="container max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2">My Addresses</h1>
            <p className="text-stone-600">Manage your delivery addresses</p>
          </div>
          <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Address
          </button>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2].map((i) => <div key={i} className="h-40 bg-cream-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : addresses?.length === 0 ? (
          <div className="text-center py-20">
            <MapPin className="h-12 w-12 text-stone-400 mx-auto mb-4" />
            <h2 className="text-xl mb-2">No addresses saved</h2>
            <p className="text-stone-600 mb-6">Add an address for faster checkout</p>
            <button onClick={() => setShowModal(true)} className="btn-primary">Add Address</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {addresses?.map((addr) => (
              <div key={addr.id} className="card-section relative">
                {addr.isDefault && (
                  <span className="absolute top-3 right-3 bg-terracotta-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Check className="h-3 w-3" /> Default
                  </span>
                )}
                <p className="font-semibold text-stone-900 mb-1">{addr.fullName}</p>
                <p className="text-sm text-stone-600 mb-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                <p className="text-sm text-stone-600 mb-1">{addr.city}, {addr.state} — {addr.pincode}</p>
                <p className="text-sm text-stone-500 mb-4">Phone: {addr.phone}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(addr)} className="btn-outlined text-xs px-3 py-1.5 flex items-center gap-1">
                    <Edit3 className="h-3 w-3" /> Edit
                  </button>
                  {!addr.isDefault && (
                    <button onClick={() => defaultMutation.mutate(addr.id)} className="btn-outlined text-xs px-3 py-1.5">
                      Set Default
                    </button>
                  )}
                  <button onClick={() => deleteMutation.mutate(addr.id)} className="text-red-500 hover:text-red-700 text-xs px-3 py-1.5 ml-auto flex items-center gap-1">
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Address' : 'Add Address'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {['fullName', 'phone', 'line1', 'line2', 'city', 'state', 'pincode'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  {field === 'fullName' ? 'Full Name' : field === 'line1' ? 'Address Line 1' : field === 'line2' ? 'Address Line 2' : field.charAt(0).toUpperCase() + field.slice(1)}
                  {field !== 'line2' && ' *'}
                </label>
                <input
                  type="text"
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="input"
                  placeholder={field === 'pincode' ? '6-digit pincode' : undefined}
                />
                {errors[field] && <p className="text-red-600 text-xs mt-1">{errors[field]}</p>}
              </div>
            ))}
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="rounded" />
              <span className="text-sm text-stone-700">Set as default address</span>
            </label>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex-1" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : editingId ? 'Update Address' : 'Save Address'}
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="btn-outlined">Cancel</button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
