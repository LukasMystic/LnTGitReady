import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LogOut, Shield, Mail, AlertCircle, Edit, Trash2, Download, Search, ChevronsUpDown, ArrowUp, ArrowDown, Power, PowerOff } from 'lucide-react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
// --- Interfaces ---
interface FormInputProps {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface IRegistration {
  _id: string;
  fullName: string;
  nim: string;
  binusianEmail: string;
  privateEmail: string;
  major: string;
  phoneNumber: string;
}

type SortableKeys = keyof Omit<IRegistration, '_id' | 'privateEmail'>;


// --- Komponen Input ---
const FormInput = ({ icon, placeholder, type = 'text', id, name, value, onChange }: FormInputProps) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full pl-12 pr-4 py-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300 text-lg"
      placeholder={placeholder}
      required
    />
  </div>
);

// --- Modal Edit ---
const EditModal = ({ registration, onClose, onSave, token }: { registration: IRegistration, onClose: () => void, onSave: (updatedReg: IRegistration) => void, token: string }) => {
    const [formData, setFormData] = useState(registration);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.put(`${API_URL}/api/admin/registrations/${formData._id}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            onSave(response.data.data);
            onClose();
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message || 'Failed to update.');
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl shadow-lg w-full max-w-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Edit Registration</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="w-full p-3 bg-gray-700 rounded-lg" />
                    <input type="text" name="nim" value={formData.nim} onChange={handleChange} placeholder="NIM" className="w-full p-3 bg-gray-700 rounded-lg" />
                    <input type="email" name="binusianEmail" value={formData.binusianEmail} onChange={handleChange} placeholder="Binusian Email" className="w-full p-3 bg-gray-700 rounded-lg" />
                    <input type="email" name="privateEmail" value={formData.privateEmail} onChange={handleChange} placeholder="Private Email" className="w-full p-3 bg-gray-700 rounded-lg" />
                    <input type="text" name="major" value={formData.major} onChange={handleChange} placeholder="Major" className="w-full p-3 bg-gray-700 rounded-lg" />
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="w-full p-3 bg-gray-700 rounded-lg" />
                    {error && <p className="text-red-400 text-center">{error}</p>}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" disabled={isLoading} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500">
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Halaman Login Admin ---
const AdminLoginPage = ({ onLoginSuccess }: { onLoginSuccess: (token: string) => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.post(`${API_URL}/api/admin/login`, { email, password });
            onLoginSuccess(response.data.token);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message || 'Login failed. Please check your credentials.');
            } else {
                setError('An unknown error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl shadow-cyan-500/10">
                    <h2 className="text-3xl font-bold text-center mb-6">Admin Login</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormInput icon={<Mail className="h-6 w-6 text-gray-400" />} placeholder="Email" type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <FormInput icon={<Shield className="h-6 w-6 text-gray-400" />} placeholder="Password" type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {error && <p className="text-red-400 text-center flex items-center gap-2 justify-center"><AlertCircle size={20}/> {error}</p>}
                        <button type="submit" disabled={isLoading} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-xl disabled:bg-gray-600">
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- Halaman Dashboard Admin ---
const AdminDashboard = ({ token, onLogout }: { token: string, onLogout: () => void }) => {
    const [registrations, setRegistrations] = useState<IRegistration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingRegistration, setEditingRegistration] = useState<IRegistration | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'ascending' | 'descending' } | null>(null);
    const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean | null>(null);
    const [isStatusLoading, setIsStatusLoading] = useState(false);


    const fetchRegistrations = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/admin/registrations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setRegistrations(response.data);
        } catch (err) {
            console.error("Fetch error:", err);
            setError('Failed to fetch registrations. Your session might have expired.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    const fetchRegistrationStatus = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/api/settings/status`);
            setIsRegistrationOpen(response.data.isRegistrationOpen);
        } catch (err) {
            console.error("Could not fetch registration status", err);
        }
    }, []);

    useEffect(() => {
        fetchRegistrations();
        fetchRegistrationStatus();
    }, [fetchRegistrations, fetchRegistrationStatus]);

    const handleUpdate = (updatedReg: IRegistration) => {
        setRegistrations(registrations.map(reg => reg._id === updatedReg._id ? updatedReg : reg));
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this registration?')) {
            try {
                await axios.delete(`${API_URL}/api/admin/registrations/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setRegistrations(registrations.filter(reg => reg._id !== id));
            } catch (err) {
                console.error("Delete error:", err);
                alert('Failed to delete registration.');
            }
        }
    };

    const toggleRegistrationStatus = async () => {
        setIsStatusLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/admin/settings/toggle`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setIsRegistrationOpen(response.data.isRegistrationOpen);
        } catch (err) {
            alert('Failed to update status.');
        } finally {
            setIsStatusLoading(false);
        }
    };

    const exportToCsv = () => {
        const headers = ['FullName', 'NIM', 'BinusianEmail', 'PrivateEmail', 'Major', 'PhoneNumber'];
        const csvRows = [
            headers.join(','),
            ...sortedRegistrations.map(reg => 
                [reg.fullName, reg.nim, reg.binusianEmail, reg.privateEmail, reg.major, reg.phoneNumber].map(field => `"${field}"`).join(',')
            )
        ];
        
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'registrations.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const requestSort = (key: SortableKeys) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredRegistrations = useMemo(() => {
        return registrations.filter(reg =>
            reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.nim.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [registrations, searchTerm]);

    const sortedRegistrations = useMemo(() => {
        const sortableItems = [...filteredRegistrations];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredRegistrations, sortConfig]);
    
    const getSortIcon = (key: SortableKeys) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <ChevronsUpDown size={16} className="ml-2 opacity-50" />;
        }
        if (sortConfig.direction === 'ascending') {
            return <ArrowUp size={16} className="ml-2" />;
        }
        return <ArrowDown size={16} className="ml-2" />;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 sm:p-8">
            <div className="container mx-auto">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                    <div className="flex items-center gap-4 flex-wrap">
                        {isRegistrationOpen !== null && (
                            <button
                                onClick={toggleRegistrationStatus}
                                disabled={isStatusLoading}
                                className={`font-bold py-2 px-4 rounded-lg flex items-center gap-2 ${isRegistrationOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} disabled:opacity-50`}
                            >
                                {isRegistrationOpen ? <PowerOff size={20}/> : <Power size={20}/>}
                                <span>{isRegistrationOpen ? 'Close Registration' : 'Open Registration'}</span>
                            </button>
                        )}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name or NIM..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-gray-700 pl-10 pr-4 py-2 rounded-lg"
                            />
                        </div>
                        <button onClick={exportToCsv} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                           <Download size={20}/> <span>Export CSV</span>
                        </button>
                        <button onClick={onLogout} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
                {loading ? <p>Loading registrations...</p> :
                 error ? <p className="text-red-400">{error}</p> :
                 (
                    <div className="bg-gray-800 rounded-xl overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-700/50">
                                <tr>
                                    <th className="p-4"><button onClick={() => requestSort('fullName')} className="flex items-center">Nama Lengkap {getSortIcon('fullName')}</button></th>
                                    <th className="p-4"><button onClick={() => requestSort('nim')} className="flex items-center">NIM {getSortIcon('nim')}</button></th>
                                    <th className="p-4"><button onClick={() => requestSort('binusianEmail')} className="flex items-center">Email Binusian {getSortIcon('binusianEmail')}</button></th>
                                    <th className="p-4"><button onClick={() => requestSort('major')} className="flex items-center">Jurusan {getSortIcon('major')}</button></th>
                                    <th className="p-4"><button onClick={() => requestSort('phoneNumber')} className="flex items-center">No. Telepon {getSortIcon('phoneNumber')}</button></th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedRegistrations.map((reg, index) => (
                                    <tr key={reg._id} className={`border-t border-gray-700 ${index % 2 === 0 ? 'bg-gray-800/50' : ''}`}>
                                        <td className="p-4">{reg.fullName}</td>
                                        <td className="p-4">{reg.nim}</td>
                                        <td className="p-4">{reg.binusianEmail}</td>
                                        <td className="p-4">{reg.major}</td>
                                        <td className="p-4">{reg.phoneNumber}</td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => setEditingRegistration(reg)} className="text-blue-400 hover:text-blue-300"><Edit size={20}/></button>
                                                <button onClick={() => handleDelete(reg._id)} className="text-red-400 hover:text-red-300"><Trash2 size={20}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 )
                }
            </div>
            {editingRegistration && (
                <EditModal 
                    registration={editingRegistration} 
                    onClose={() => setEditingRegistration(null)}
                    onSave={handleUpdate}
                    token={token}
                />
            )}
        </div>
    );
};

// --- Komponen Utama Aplikasi Admin ---
function App() {
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'));

  const handleLoginSuccess = (token: string) => {
      localStorage.setItem('adminToken', token);
      setAdminToken(token);
  }
  
  const handleLogout = () => {
      localStorage.removeItem('adminToken');
      setAdminToken(null);
  }

  return (
      adminToken ? 
      <AdminDashboard token={adminToken} onLogout={handleLogout} /> : 
      <AdminLoginPage onLoginSuccess={handleLoginSuccess} />
  );
}

export default App;
