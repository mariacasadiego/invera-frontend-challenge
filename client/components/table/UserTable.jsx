'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePaginatedUsers } from '@/hooks/usePaginatedUsers';
import { useDeleteUser } from '@/hooks/useDeleteUser';
import AddUserModal from '../header/AddUserModal';
import Loader from '../Loader';
import DeleteConfirmationModal from './DeleteConfirmationModal';

import {
  FaUserAlt,
  FaPhoneAlt,
  FaCheckSquare,
  FaCheck,
} from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { BsFillSuitcaseLgFill } from 'react-icons/bs';
import { MdModeEdit } from 'react-icons/md';
import { ImBin2 } from 'react-icons/im';
import { LuChevronsUpDown } from 'react-icons/lu';
import { ITEMS_PER_PAGE, DEBOUNCE_DELAY } from '@/utils/constants';

const CustomCheckbox = ({ checked, onChange, className = '' }) => {
  return (
    <label className={`relative inline-flex items-center cursor-pointer ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className={`
  custom-checkbox-container
  w-3 h-3 rounded
  border-[0.4px] border-solid
  ${checked
          ? 'bg-accent-primary border-accent-primary'
          : 'bg-secondary border-primary'
        }
  transition-all
  peer-hover:border-accent-primary
`}>
        {checked && (
          <FaCheck className="custom-checkbox-icon w-2 h-2 text-white" />
        )}
      </div>
    </label>
  );
};

const getCompanyLogoUrl = (company) => {
  if (!company) return null;
  return `https://logo.clearbit.com/${company.toLowerCase().replace(/\s/g, '')}.com`;
};

const UserTable = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState('asc');
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const { data, isLoading, error } = usePaginatedUsers({
    page,
    limit: ITEMS_PER_PAGE,
    query,
    sort,
    order,
  });

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuery(searchTerm);
      setPage(1);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const { users, total } = useMemo(() => data || { users: [], total: 0 }, [data]);

  const start = useMemo(() => {
    if (users.length === 0) return 0;
    return (page - 1) * ITEMS_PER_PAGE + 1;
  }, [page, users.length]);

  const end = useMemo(() => {
    if (users.length === 0) return 0;
    return Math.min(page * ITEMS_PER_PAGE, total);
  }, [page, total, users.length]);
  const totalPages = useMemo(() => Math.ceil(total / ITEMS_PER_PAGE), [total]);
  const allSelected = useMemo(() => users.length > 0 && users.every((u) => selectedUsers.has(u.id)), [users, selectedUsers]);

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map((u) => u.id)));
    }
  };

  const toggleRow = (id) => {
    setSelectedUsers((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) {
        copy.delete(id);
      } else {
        copy.add(id);
      }
      return copy;
    });
  };

  const handleSort = (field) => {
    if (sort === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field);
      setOrder('asc');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (userId) => {
    setUserToDelete(userId);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      setUserToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  if (isLoading && !data) return <Loader />;
  if (error) return <div className="card p-6 text-center text-red-500">Error al cargar usuarios</div>;
  if (!data) return null;

  return (
    <>
      <div className="card overflow-hidden border-b-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 px-3 md:px-4 lg:px-10 py-4 md:py-6 border-b border-primary">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 lg:gap-6 w-full md:max-w-[996px]">
            <h2 className="text-primary font-bold text-sm md:text-base whitespace-nowrap">All Users</h2>
            <div className="w-full sm:w-auto md:w-[352px] h-[38px] md:h-[42px] relative">
              <span className="absolute top-1/2 left-2 md:left-3 transform -translate-y-1/2 text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 md:h-4 md:w-4" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search for..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-secondary text-primary border border-primary shadow-sm pl-8 md:pl-10 pr-3 md:pr-4 py-2 h-full w-full rounded-md text-xs md:text-sm placeholder:text-secondary"
              />
            </div>
          </div>

          <span className="text-xs text-left md:text-right text-primary whitespace-nowrap w-full sm:w-auto">
            <span className="accent-primary">{start} - {end}</span> of {total}
          </span>
        </div>

        <div className="hidden sm:block w-full">
          <table className="user-table w-full text-sm text-left text-primary">
            <colgroup>
              <col className="user-table-col-checkbox" />
              <col className="user-table-col-name" />
              <col className="user-table-col-phone" />
              <col className="user-table-col-location" />
              <col className="user-table-col-company" />
              <col className="user-table-col-status" />
              <col className="user-table-col-actions" />
            </colgroup>
            <thead className="uppercase text-secondary bg-secondary border-b border-primary">
              <tr className="h-[20px] sm:h-[44px] md:h-[48px]">
                <th className="px-1 md:px-1.5 py-3 md:py-4">                  <CustomCheckbox
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
                </th>
                <Header title="Name" icon={<FaUserAlt />} sortField="name" onSort={handleSort} />
                <Header title="Phone" icon={<FaPhoneAlt />} sortField="phone" onSort={handleSort} />
                <Header title="Location" icon={<FaLocationDot />} sortField="location" onSort={handleSort} textAlign="center" />
                <Header title="Company" icon={<BsFillSuitcaseLgFill />} sortField="company" onSort={handleSort} textAlign="center" />
                <Header
                  title="Status"
                  icon={<FaCheckSquare className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />}
                  sortField="status"
                  onSort={handleSort}
                  textAlign="center"
                />
                <th className="pl-1 md:pl-1.5 pr-3 md:pr-4 py-3 md:py-4 text-center whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-b border-primary hover:bg-tertiary transition ${index === users.length - 1 ? 'border-b-0' : ''
                    }`}
                >
                  <td className="px-1 md:px-1.5 py-2 sm:py-3 align-middle">
                    <CustomCheckbox
                      checked={selectedUsers.has(user.id)}
                      onChange={() => toggleRow(user.id)}
                    />
                  </td>
                  <td className="px-1 md:px-1.5 py-2 sm:py-3 align-middle">
                    <div className="flex items-center gap-1 md:gap-1.5">
                      <img
                        src={`https://i.pravatar.cc/150?u=${user.id}`}
                        alt={user.name}
                        className="w-6 h-6 md:w-7 md:h-7 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold break-words leading-tight text-xs sm:text-sm text-primary">{user.name}</div>
                        <div className="text-xs text-secondary break-words leading-tight">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-1 md:px-1.5 py-2 sm:py-3 align-middle break-words leading-tight text-xs sm:text-sm text-primary">{user.phone}</td>
                  <td className="px-1 md:px-1.5 py-2 sm:py-3 align-middle break-words leading-tight text-xs sm:text-sm text-center text-primary">{user.location}</td>
                  <td className="px-1 md:px-1.5 py-2 sm:py-3 align-middle text-center">
                    <div className="flex items-center justify-center gap-1 md:gap-1 min-w-0">
                      {user.company && (
                        <img
                          src={getCompanyLogoUrl(user.company)}
                          alt={user.company}
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                      )}
                      <span className="break-words leading-tight text-xs sm:text-sm text-primary">{user.company}</span>
                    </div>
                  </td>
                  <td className="px-1 md:px-1.5 py-2 sm:py-3 align-middle text-center">
                    <span className={`inline-flex items-center justify-center w-[56px] h-[20px] rounded-[2px] px-[6px] py-[2px] text-[11px] font-normal leading-5 whitespace-nowrap ${user.status === 'Online'
                      ? 'bg-[var(--feedback-success-surface,rgba(6,50,7,1))] border-[0.4px] border-solid border-[rgba(195,245,205,0.5)] text-[var(--feedback-success-text-secondary,rgba(195,245,205,1))]'
                      : 'bg-[rgba(241,241,243,0.2)] border-[0.6px] border-solid border-[rgba(186,186,186,0.2)] text-[var(--text-primary,rgba(186,186,186,1))]'
                      }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="pl-0.5 md:pl-1 pr-3 md:pr-4 py-2 sm:py-3 align-middle text-center overflow-visible whitespace-nowrap">
                    <div className="flex items-center justify-center gap-0.5 md:gap-1 w-full">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEdit(user);
                        }}
                        className="btn-action-edit px-1 py-0.5 rounded flex-shrink-0"
                        aria-label="Edit user"
                      >
                        <MdModeEdit size={12} className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(user.id);
                        }}
                        disabled={isDeleting}
                        className="btn-action-delete px-1 py-0.5 rounded disabled:opacity-40 flex-shrink-0"
                        aria-label="Delete user"
                      >
                        <ImBin2 size={11} className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden space-y-3 px-3 py-3">
          {users.map((user) => (
            <div key={user.id} className="card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <CustomCheckbox
                    checked={selectedUsers.has(user.id)}
                    onChange={() => toggleRow(user.id)}
                  />
                  <img
                    src={`https://i.pravatar.cc/150?u=${user.id}`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-primary">{user.name}</div>
                    <div className="text-xs text-secondary truncate">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="btn-action-edit p-1 rounded flex-shrink-0"
                    aria-label="Edit user"
                  >
                    <MdModeEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    disabled={isDeleting}
                    className="btn-action-delete p-1 rounded disabled:opacity-40 flex-shrink-0"
                    aria-label="Delete user"
                  >
                    <ImBin2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 border-t border-primary pt-3">
                <div className="flex items-center gap-2">
                  <FaPhoneAlt className="text-secondary w-4 h-4 flex-shrink-0" />
                  <span className="text-xs text-secondary">Phone:</span>
                  <span className="text-xs text-primary">{user.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaLocationDot className="text-secondary w-4 h-4 flex-shrink-0" />
                  <span className="text-xs text-secondary">Location:</span>
                  <span className="text-xs text-primary">{user.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BsFillSuitcaseLgFill className="text-secondary w-4 h-4 flex-shrink-0" />
                  <span className="text-xs text-secondary">Company:</span>
                  <div className="flex items-center gap-1.5">
                    {user.company && (
                      <img
                        src={getCompanyLogoUrl(user.company)}
                        alt={user.company}
                        className="w-4 h-4 flex-shrink-0"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    )}
                    <span className="text-xs text-primary">{user.company}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckSquare className="text-secondary w-4 h-4 flex-shrink-0" />
                  <span className="text-xs text-secondary">Status:</span>
                  <span className={`inline-flex items-center justify-center w-[56px] h-[20px] rounded-[2px] px-[6px] py-[2px] text-[11px] font-normal leading-5 whitespace-nowrap ${user.status === 'Online'
                    ? 'bg-[var(--feedback-success-surface,rgba(6,50,7,1))] border-[0.4px] border-solid border-[rgba(195,245,205,0.5)] text-[var(--feedback-success-text-secondary,rgba(195,245,205,1))]'
                    : 'bg-[rgba(241,241,243,0.2)] border-[0.6px] border-solid border-[rgba(186,186,186,0.2)] text-[var(--text-primary,rgba(186,186,186,1))]'
                    }`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end items-center px-3 sm:px-4 lg:px-10 py-3 sm:py-4 border-t border-primary text-secondary text-xs sm:text-sm">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-2 sm:px-3 py-1 bg-tertiary hover:bg-hover text-primary rounded transition-colors disabled:opacity-40 mr-2 text-xs sm:text-sm"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-2 sm:px-3 py-1 bg-tertiary hover:bg-hover text-primary rounded transition-colors disabled:opacity-40 text-xs sm:text-sm"
          >
            Next
          </button>
        </div>
      </div>

      <AddUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={editingUser}
      />

      <DeleteConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

const Header = ({ title, icon, sortField, onSort, className = '', textAlign = 'left' }) => {
  return (
    <th className={`px-2 sm:px-3 py-3 md:py-4 ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onSort(sortField);
        }}
        className={`flex items-center gap-1.5 text-secondary hover:text-primary focus:outline-none w-full text-xs sm:text-sm ${textAlign === 'center' ? 'justify-center' : 'text-left'
          }`}
      >
        <span className="flex-shrink-0">{icon}</span>
        <span>{title}</span>
        <LuChevronsUpDown className="w-3 h-3 flex-shrink-0" />
      </button>
    </th>
  );
};

export default UserTable;