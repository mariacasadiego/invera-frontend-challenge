'use client';

import { useState, useEffect } from 'react';
import { useCreateUser } from '@/hooks/useCreateUser';
import { useUpdateUser } from '@/hooks/useUpdateUser';

const AddUserModal = ({ isOpen, onClose, user = null }) => {
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const isEditMode = !!user;
  const isPending = isCreating || isUpdating;

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    company: '',
    status: 'Offline',
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        company: user.company || '',
        status: user.status || 'Offline',
      });
    } else {
      setForm({
        name: '',
        email: '',
        phone: '',
        location: '',
        company: '',
        status: 'Offline',
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      updateUser({ id: user.id, updates: form });
    } else {
      createUser(form);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
    className="modal-backdrop fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-[9999] p-0 sm:p-4"
  >
      <div className="card p-4 sm:p-5 md:p-6 rounded-none sm:rounded-md w-full h-screen sm:h-auto sm:w-full sm:max-w-md border-0 sm:border text-primary relative flex flex-col sm:block overflow-y-auto sm:max-h-[90vh]">
        <div className="flex-1 flex flex-col justify-center sm:flex-none sm:block min-h-0">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-2 sm:right-2 text-secondary hover:text-primary text-base sm:text-lg z-10 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center"
          >
            ✕
          </button>
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 pr-8 sm:pr-6">
            {isEditMode ? 'Edit User' : 'Add New User'}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
            <input
              name="name"
              type="text"
              required
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="input-base"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="input-base"
            />
            <input
              name="phone"
              type="text"
              required
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="input-base"
            />
            <input
              name="location"
              type="text"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              className="input-base"
            />
            <input
              name="company"
              type="text"
              placeholder="Company"
              value={form.company}
              onChange={handleChange}
              className="input-base"
            />
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input-base"
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
            <button
              type="submit"
              disabled={isPending}
              className="button-primary w-full py-2 sm:py-2.5 text-sm sm:text-base font-medium disabled:opacity-50"
            >
              {isPending
                ? (isEditMode ? 'Updating...' : 'Adding...')
                : (isEditMode ? 'Update User' : 'Add User')
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;