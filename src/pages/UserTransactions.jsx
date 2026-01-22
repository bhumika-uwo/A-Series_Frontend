import React, { useState, useEffect } from 'react';
import { Clock, Loader2, Eye, X, Calendar, Receipt } from 'lucide-react';
import axios from 'axios';
import { API } from '../types';

const UserTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API}/revenue/user/transactions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('[USER TRANSACTIONS] Response:', response.data);
            setTransactions(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Failed to fetch transactions:", err);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleViewDetails = (transaction) => {
        setSelectedTransaction(transaction);
        setShowDetailsModal(true);
    };

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto bg-transparent">
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-maintext">My Transactions</h1>
                        <p className="text-sm text-subtext mt-1">View your purchase history and payment details</p>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-secondary border-b border-border">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-bold text-subtext uppercase tracking-[1.5px]">Date</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-subtext uppercase tracking-[1.5px]">App / Agent</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-subtext uppercase tracking-[1.5px]">Plan</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-subtext uppercase tracking-[1.5px]">Amount</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-subtext uppercase tracking-[1.5px]">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-subtext uppercase tracking-[1.5px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="py-24 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                                <p className="mt-4 text-sm font-bold text-subtext">Loading transactions...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : transactions.length > 0 ? (
                                    transactions.map((t) => (
                                        <tr key={t._id} className="border-b border-secondary hover:bg-secondary transition-colors last:border-0 group">
                                            <td className="px-8 py-5">
                                                <span className="text-xs font-medium text-subtext">{formatDate(t.createdAt)}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-sm font-bold text-maintext group-hover:text-primary transition-colors">{t.agentId?.agentName || 'Unknown App'}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-xs font-medium text-subtext">{t.plan || 'N/A'}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-sm font-black text-maintext">₹{t.amount.toFixed(2)}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${t.status === 'Success'
                                                    ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
                                                    : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${t.status === 'Success' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                                    {t.status}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button
                                                    onClick={() => handleViewDetails(t)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-maintext rounded-xl text-xs font-bold hover:bg-border transition-all"
                                                    title="View Transaction Details"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-24 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-2">
                                                    <Receipt className="w-8 h-8 text-subtext/20" />
                                                </div>
                                                <p className="text-subtext text-sm font-medium">No transactions found yet.</p>
                                                <p className="text-subtext text-xs">Subscribe to an agent to see your purchase history here.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Transaction Details Modal */}
                {showDetailsModal && selectedTransaction && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-card w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-maintext">Transaction Details</h2>
                                    <button
                                        onClick={() => setShowDetailsModal(false)}
                                        className="p-2 hover:bg-secondary rounded-xl transition-colors"
                                    >
                                        <X className="w-5 h-5 text-subtext" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Transaction ID & Date */}
                                    <div className="bg-secondary rounded-2xl p-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs font-bold text-subtext uppercase mb-2">Transaction ID</p>
                                                <p className="text-sm font-bold text-maintext">#{selectedTransaction.transactionId || selectedTransaction._id.substring(selectedTransaction._id.length - 12).toUpperCase()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-subtext uppercase mb-2">Date</p>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-subtext" />
                                                    <p className="text-sm font-medium text-maintext">{formatDate(selectedTransaction.createdAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* App Details */}
                                    <div>
                                        <p className="text-xs font-bold text-subtext uppercase mb-3">App / Agent</p>
                                        <div className="bg-card border border-border rounded-2xl p-4">
                                            <p className="text-lg font-bold text-maintext">{selectedTransaction.agentId?.agentName || 'Unknown App'}</p>
                                            <p className="text-xs text-subtext mt-1">{selectedTransaction.plan || 'Subscription'}</p>
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div>
                                        <p className="text-xs font-bold text-subtext uppercase mb-3">Amount Paid</p>
                                        <div className="bg-card border border-border rounded-2xl p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-subtext">Total Amount</span>
                                                <span className="text-2xl font-black text-primary">₹{selectedTransaction.amount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <p className="text-xs font-bold text-subtext uppercase mb-3">Payment Status</p>
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${selectedTransaction.status === 'Success'
                                            ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
                                            : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
                                            }`}>
                                            <div className={`w-2 h-2 rounded-full ${selectedTransaction.status === 'Success' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                            <span className="text-sm font-bold uppercase">{selectedTransaction.status}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={() => setShowDetailsModal(false)}
                                        className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserTransactions;
