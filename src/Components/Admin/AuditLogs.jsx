import React, { useState, useEffect } from 'react';
import { FileText, Search } from 'lucide-react';

import apiService from '../../services/apiService';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchLogs = async () => {
        try {
            const data = await apiService.getAuditLogs(search);
            setLogs(data);
        } catch (err) {
            console.error("Failed to fetch logs", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 10000); // Poll every 10s for real-time logs
        return () => clearInterval(interval);
    }, [search]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-maintext">Audit Logs</h2>

            <div className="bg-card border border-border rounded-xl p-4 flex gap-2">
                <Search className="w-5 h-5 text-subtext" />
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search logs by user, action, or target..."
                    className="bg-transparent outline-none flex-1 text-maintext placeholder:text-subtext"
                />
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-secondary border-b border-border text-subtext">
                        <tr>
                            <th className="px-5 py-3 font-medium">Action</th>
                            <th className="px-5 py-3 font-medium">User</th>
                            <th className="px-5 py-3 font-medium">Target</th>
                            <th className="px-5 py-3 font-medium text-right">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="px-5 py-10 text-center text-subtext">Loading logs...</td>
                            </tr>
                        ) : logs.length > 0 ? (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-secondary font-mono text-xs cursor-pointer transition-colors">
                                    <td className="px-5 py-3 text-primary">{log.action}</td>
                                    <td className="px-5 py-3 text-maintext">{log.user}</td>
                                    <td className="px-5 py-3 text-subtext">{log.target}</td>
                                    <td className="px-5 py-3 text-right text-subtext">{log.time}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-5 py-10 text-center text-subtext">No audit logs found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogs;
