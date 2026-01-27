import React, { useState, useEffect } from 'react';
import { BadgeCheck, AlertCircle, Clock, CheckCircle2, Search, Filter, MessageSquare, User, Loader2 } from 'lucide-react';
import apiService from '../../services/apiService';

const AdminSupport = () => {
    const [reports, setReports] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filter, setFilter] = useState('all'); // all, open, resolved
    const [filterCategory, setFilterCategory] = useState('all'); // 'all', 'contact', 'faq', 'security'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);
    const [resolutionNote, setResolutionNote] = useState('');
    const [isResolving, setIsResolving] = useState(false);

    const fetchInquiries = async (search = '') => {
        if (reports.length === 0) setInitialLoading(true);
        else setIsRefreshing(true);
        try {
            const [reportsData, ticketsData] = await Promise.all([
                apiService.getReports(search),
                apiService.getSupportTickets(search)
            ]);

            // Normalize reports
            const normalizedReports = reportsData.map(r => ({
                ...r,
                id: r._id,
                origin: 'report',
                title: r.description,
                user: r.userId?.name || 'Unknown User',
                email: r.userId?.email || 'No Email',
                date: r.timestamp
            }));

            // Normalize support tickets
            const normalizedTickets = ticketsData.map(t => ({
                ...t,
                id: t._id,
                origin: 'ticket',
                type: t.issueType,
                title: t.subject || t.message,
                user: t.name || t.userId?.name || 'Guest',
                email: t.email,
                phone: t.phone,
                date: t.createdAt,
                source: t.source || 'contact_us', // Add source mapping
                priority: 'medium' // Support tickets don't have priority in model yet
            }));

            setReports([...normalizedReports, ...normalizedTickets].sort((a, b) => new Date(b.date) - new Date(a.date)));
        } catch (err) {
            console.error(err);
        } finally {
            setInitialLoading(false);
            setIsRefreshing(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchInquiries();
    }, []);

    const handleSearch = () => {
        fetchInquiries(searchQuery);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleResolve = async (status) => {
        if (!selectedReport) return;
        // ... (rest of handleResolve is unchanged, just providing context for the tool)
        setIsResolving(true);
        try {
            if (selectedReport.origin === 'report') {
                await apiService.resolveReport(selectedReport._id, status, resolutionNote);
            } else {
                await apiService.updateSupportTicketStatus(selectedReport._id, status, resolutionNote);
            }
            // Refresh with current search query
            await fetchInquiries(searchQuery);
            setSelectedReport(null);
            setResolutionNote('');
        } catch (err) {
            alert("Failed to update inquiry");
        } finally {
            setIsResolving(false);
        }
    };

    const filteredReports = reports.filter(r => {
        // ... (rest of filter is unchanged)
        // First filter by Category
        if (filterCategory !== 'all') {
            if (filterCategory === 'security') {
                if (r.origin !== 'report') return false;
            } else if (filterCategory === 'contact') {
                if (r.origin !== 'ticket' || r.source !== 'contact_us') return false;
            } else if (filterCategory === 'faq') {
                if (r.origin !== 'ticket' || r.source !== 'help_faq') return false;
            }
        }

        // Then filter by Status
        if (filter === 'all') return true;
        if (filter === 'open') return ['open', 'in-progress'].includes(r.status);
        if (filter === 'resolved') return ['resolved', 'closed'].includes(r.status);

        return true;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
            case 'in-progress': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
            case 'resolved': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
            default: return 'bg-secondary text-subtext border-border';
        }
    };

    const reportFilterTypeColor = (type) => {
        // Simple hash to color or manual mapping
        if (!type) return 'bg-gray-500/10 text-gray-500';
        if (type.includes('Bug')) return 'bg-red-500/10 text-red-600';
        if (type.includes('Technical')) return 'bg-blue-500/10 text-blue-600';
        if (type.includes('Payment')) return 'bg-purple-500/10 text-purple-600';
        return 'bg-secondary text-subtext border-border';
    };

    if (initialLoading) return <div className="h-96 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6 max-h-[calc(100vh-100px)] flex flex-col">
            <div className="flex flex-col gap-4 shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-maintext">User Support</h2>
                        <p className="text-subtext text-sm">Manage user complaints and inquiries</p>
                    </div>
                    {/* Status Filter Buttons */}
                    <div className="flex gap-2">
                        {['all', 'open', 'resolved'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-card text-subtext hover:bg-secondary border border-border'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex gap-2">
                    {['all', 'contact', 'faq', 'security'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${filterCategory === cat
                                ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                                : 'bg-white dark:bg-surface text-subtext hover:bg-secondary border border-border'
                                }`}
                        >
                            {cat === 'contact' ? 'Contact Us' : cat === 'faq' ? 'Help Center' : cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Reports List */}
                <div className="lg:col-span-1 bg-card border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm">
                    <div className="p-4 border-b border-border bg-secondary">
                        <div className="relative">
                            <button onClick={handleSearch} className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                                {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Search className="w-4 h-4 text-subtext" />}
                            </button>
                            <input
                                type="text"
                                placeholder="Search by name, email, or subject... (Press Enter)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isRefreshing}
                                className={`w-full bg-card border border-border rounded-xl pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 text-maintext placeholder-subtext/50 ${isRefreshing ? 'opacity-70' : ''}`}
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-2">
                        {filteredReports.map(report => (
                            <div
                                key={report.id}
                                onClick={() => setSelectedReport(report)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedReport?.id === report.id ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-card border-transparent hover:bg-secondary'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${report.origin === 'report' ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'}`}>{report.origin}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${report.type === 'bug' ? 'bg-red-500/10 text-red-700 dark:text-red-400' : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'}`}>{report.type}</span>
                                    </div>
                                    <span className="text-[10px] text-subtext">{new Date(report.date).toLocaleDateString()}</span>
                                </div>
                                <h4 className="font-bold text-maintext text-sm line-clamp-1">{report.title}</h4>
                                <div className="flex items-center gap-2 mt-2 text-xs text-subtext">
                                    <User className="w-3 h-3" />
                                    <span>{report.user}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(report.status)} uppercase`}>{report.status}</span>
                                    {report.priority === 'high' && <AlertCircle className="w-4 h-4 text-red-500" />}
                                </div>
                            </div>
                        ))}
                        {filteredReports.length === 0 && <div className="p-8 text-center text-subtext text-sm">No reports found</div>}
                    </div>
                </div>

                {/* Report Details */}
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl flex flex-col shadow-sm overflow-hidden h-[600px]">
                    {selectedReport ? (
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="p-6 border-b border-border bg-secondary/50 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${selectedReport.origin === 'report' ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'}`}>{selectedReport.origin}</span>
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${reportFilterTypeColor(selectedReport.type)}`}>{selectedReport.type}</span>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(selectedReport.status)}`}>{selectedReport.status}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-maintext mb-1">{selectedReport.title.length > 50 ? selectedReport.title.substring(0, 50) + '...' : selectedReport.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-subtext">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Submitted on {new Date(selectedReport.date).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Sender Profile Card */}
                                <div className="bg-secondary/30 border border-border rounded-xl p-5">
                                    <h4 className="text-xs font-bold text-subtext uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <User className="w-4 h-4" /> Sender Details
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                                {selectedReport.user.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-xs text-subtext mb-0.5">Name</p>
                                                <p className="font-bold text-maintext text-sm">{selectedReport.user}</p>
                                            </div>
                                        </div>

                                        <div className="pl-6 border-l border-border">
                                            <p className="text-xs text-subtext mb-0.5">Email Address</p>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-primary text-base select-all">{selectedReport.email}</p>
                                            </div>
                                        </div>

                                        {selectedReport.phone && (
                                            <div className="pl-6 border-l border-border">
                                                <p className="text-xs text-subtext mb-0.5">Phone Number</p>
                                                <p className="font-bold text-maintext text-sm select-all">{selectedReport.phone}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Message Content */}
                                <div>
                                    <h4 className="text-xs font-bold text-subtext uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" /> Message Content
                                    </h4>
                                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                                        {selectedReport.subject && (
                                            <div className="mb-4 pb-4 border-b border-border">
                                                <p className="text-xs text-subtext mb-1">Subject</p>
                                                <p className="font-bold text-maintext text-lg">{selectedReport.subject}</p>
                                            </div>
                                        )}
                                        <p className="text-maintext whitespace-pre-wrap leading-relaxed">
                                            {selectedReport.origin === 'ticket' ? selectedReport.message : selectedReport.title}
                                        </p>
                                    </div>
                                </div>

                                {/* Resolution Action */}
                                <div className="bg-secondary/10 border border-border rounded-xl p-5 mt-4">
                                    <h4 className="text-sm font-bold text-maintext mb-3">Resolution Notes & Action</h4>
                                    <textarea
                                        className="w-full bg-card border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none min-h-[100px] mb-4 text-maintext placeholder-subtext/50"
                                        placeholder="Add internal notes about the resolution or response..."
                                        value={resolutionNote}
                                        onChange={(e) => setResolutionNote(e.target.value)}
                                    />
                                    <div className="flex gap-3 justify-end">
                                        {selectedReport.status !== 'resolved' && (
                                            <button
                                                disabled={isResolving}
                                                onClick={() => handleResolve('resolved')}
                                                className="bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20 disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {isResolving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                Mark Resolved
                                            </button>
                                        )}
                                        {selectedReport.status === 'open' && (
                                            <button
                                                disabled={isResolving}
                                                onClick={() => handleResolve('in-progress')}
                                                className="bg-amber-500 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 disabled:opacity-50"
                                            >
                                                Mark In-Progress
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-subtext opacity-50 bg-secondary/20">
                            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                                <MessageSquare className="w-10 h-10 text-subtext/50" />
                            </div>
                            <p className="font-medium text-lg">Select a ticket to view details</p>
                            <p className="text-sm">Choose from the list on the left to manage inquiries</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSupport;
