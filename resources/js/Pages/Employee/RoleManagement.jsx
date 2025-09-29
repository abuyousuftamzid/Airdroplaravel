import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function RoleManagement({ users, availableRoles }) {
    const [editingUser, setEditingUser] = useState(null);
    const [newRole, setNewRole] = useState('');

    const handleRoleUpdate = (userId, currentRole) => {
        setEditingUser(userId);
        setNewRole(currentRole);
    };

    const confirmRoleUpdate = (userId) => {
        if (!newRole) return;

        router.patch(route('admin.employees.update-role', userId), {
            user_type: newRole
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingUser(null);
                setNewRole('');
            }
        });
    };

    const cancelRoleUpdate = () => {
        setEditingUser(null);
        setNewRole('');
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            'Airdrop_Admin': 'bg-red-100 text-red-800',
            'Airdrop_Master_Admin': 'bg-purple-100 text-purple-800',
            'Airdrop_Manager': 'bg-blue-100 text-blue-800',
            'Airdrop_Supervisor': 'bg-green-100 text-green-800',
            'Airdrop_Operations_Supervisor': 'bg-yellow-100 text-yellow-800',
            'Customer': 'bg-gray-100 text-gray-800',
            'POS_Staff': 'bg-indigo-100 text-indigo-800'
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Role Management
                    </h2>
                    <Link
                        href={route('admin.employees.index')}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Back to Employees
                    </Link>
                </div>
            }
        >
            <Head title="Role Management" />

            <div className="py-12">
                <div className="w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header Info */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Manage User Roles
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Assign and update user roles to control access permissions across the system.
                                </p>
                            </div>

                            {/* Users Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Current Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.data.map((user) => (
                                            <tr key={user.user_id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                                                                <span className="text-sm font-medium text-white">
                                                                    {(user.user_first_last_name || 'U').charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.user_first_last_name}
                                                                {user.user_second_last_name && ` ${user.user_second_last_name}`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {user.user_email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingUser === user.user_id ? (
                                                        <select
                                                            value={newRole}
                                                            onChange={(e) => setNewRole(e.target.value)}
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                        >
                                                            {Object.entries(availableRoles).map(([key, label]) => (
                                                                <option key={key} value={key}>
                                                                    {label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.user_type)}`}>
                                                            {availableRoles[user.user_type] || user.user_type}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        user.user_account_status === 'activate'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {user.user_account_status === 'activate' ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {editingUser === user.user_id ? (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => confirmRoleUpdate(user.user_id)}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={cancelRoleUpdate}
                                                                className="text-gray-600 hover:text-gray-900"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleRoleUpdate(user.user_id, user.user_type)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Edit Role
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {users.links && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {users.from} to {users.to} of {users.total} results
                                    </div>
                                    <div className="flex space-x-1">
                                        {users.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                    link.active
                                                        ? 'bg-indigo-600 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Role Legend */}
                            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Role Types:</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                    {Object.entries(availableRoles).map(([key, label]) => (
                                        <div key={key} className="flex items-center">
                                            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getRoleBadgeColor(key).replace('text-', 'bg-').replace('100', '500')}`}></span>
                                            <span className="text-gray-700">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
