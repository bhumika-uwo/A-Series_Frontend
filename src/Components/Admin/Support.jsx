import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MessageSquare, Calendar, Filter, Trash2, CheckCircle2, AlertTriangle, Loader2, Search, X, User, Mail, Send, Check, Clock, Info, HelpCircle, ArrowLeft } from 'lucide-react';
import apiService from '../../services/apiService';

const AdminSupport = () => {
    const { t } = useLanguage();
    const [reports, setReports] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filter, setFilter] = useState('all'); // all, open, resolved
    const [filterCategory, setFilterCategory] = useState('all'); // 'all', 'contact', 'faq', 'security'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);
    const [resolutionNote, setResolutionNote] = useState('');
    const [isResolving, setIsResolving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ show: false, report: null });

    const fetchInquiries = async (search = '') => {
        // ... (fetchInquiries logic remains the same)
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
            const normalizedTickets = ticketsData.map(ticket => ({
                ...ticket,
                id: ticket._id,
                origin: 'ticket',
                type: ticket.issueType,
                title: ticket.subject || ticket.message,
                user: ticket.name || ticket.userId?.name || 'Guest',
                email: ticket.email,
                phone: ticket.phone,
                date: ticket.createdAt,
                source: ticket.source || 'contact_us', // Add source mapping
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

    const handleDeleteClick = (e, report) => {
        if (e) e.stopPropagation();
        setDeleteModal({ show: true, report });
    };

    const confirmDelete = async () => {
        const { report } = deleteModal;
        if (!report) return;

        setIsDeleting(true);
        try {
            if (report.origin === 'report') {
                await apiService.deleteReport(report.id);
            } else {
                await apiService.deleteSupportTicket(report.id);
            }
            // Refresh
            await fetchInquiries(searchQuery);
            if (selectedReport?.id === report.id) {
                setSelectedReport(null);
            }
            setDeleteModal({ show: false, report: null });
        } catch (err) {
            alert("Failed to delete inquiry");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredReports = reports.filter(r => {
        // ... (filteredReports logic)
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
            case 'open': return 'bg-primary/5 text-primary border-primary/20';
            case 'in-progress': return 'bg-primary/5 text-primary border-primary/20';
            case 'resolved': return 'bg-primary/10 text-primary border-primary/30';
            default: return 'bg-secondary text-subtext border-border';
        }
    };

    const reportFilterTypeColor = (type) => {
        if (!type) return 'bg-primary/5 text-primary border-primary/10';
        return 'bg-primary/5 text-primary border-primary/10';
    };

    if (initialLoading) return <div className="h-96 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const getFilterLabel = (f) => {
        switch (f) {
            case 'all': return t("admin.support.all");
            case 'open': return t("admin.support.open");
            case 'resolved': return t("admin.support.resolved");
            default: return f;
        }
    };

    const getCategoryLabel = (cat) => {
        switch (cat) {
            case 'contact': return t("admin.support.contactUs");
            case 'faq': return t("admin.support.helpCenter");
            case 'security': return t("admin.support.security");
            default: return t("admin.support.all");
        }
    };

    return (
        <div className="space-y-4 md:space-y-6 h-full flex flex-col relative min-h-0">
            <div className="flex flex-col gap-4 shrink-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-maintext">{t("admin.support.title")}</h2>
                        <p className="text-subtext text-sm">{t("admin.support.subtitle")}</p>
                    </div>
                    {/* Status Filter Buttons */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {['all', 'open', 'resolved'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-card text-subtext hover:bg-secondary border border-border'}`}
                            >
                                {getFilterLabel(f)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    {['all', 'contact', 'faq', 'security'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all uppercase tracking-wider whitespace-nowrap ${filterCategory === cat
                                ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                                : 'bg-white dark:bg-surface text-subtext hover:bg-secondary border border-border'
                                }`}
                        >
                            {getCategoryLabel(cat)}
                        </button>
                    ))}
                </div>
            </div>



            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 relative">
                {/* Reports List */}
                <div className={`lg:col-span-1 bg-card border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm ${selectedReport ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-border bg-secondary">
                        <div className="relative">
                            <button onClick={handleSearch} className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                                {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Search className="w-4 h-4 text-subtext" />}
                            </button>
                            <input
                                type="text"
                                placeholder={t("admin.support.searchPlaceholder")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isRefreshing}
                                className={`w-full bg-card border border-border rounded-xl pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 text-maintext placeholder-subtext/50 ${isRefreshing ? 'opacity-70' : ''}`}
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1 p-3 space-y-3">
                        {filteredReports.map(report => (
                            <div
                                key={report.id}
                                onClick={() => setSelectedReport(report)}
                                className={`p-4 rounded-[20px] cursor-pointer transition-all border relative flex flex-col gap-3 ${selectedReport?.id === report.id ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-card border-border/50 hover:bg-secondary/50'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-1.5 overflow-hidden">
                                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-tighter whitespace-nowrap">{t(report.origin?.toLowerCase())}</span>
                                        <span className="px-2 py-0.5 rounded-full bg-secondary text-subtext text-[9px] font-bold uppercase tracking-tighter whitespace-nowrap truncate max-w-[80px]">{t(report.type?.toLowerCase().replace(' ', '_')) || report.type}</span>
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteClick(e, report)}
                                        className="p-1.5 text-primary/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                        title={t("admin.support.deleteInquiry")}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <div className="space-y-1">
                                    <h4 className="font-bold text-maintext text-sm line-clamp-1 leading-tight">{report.title}</h4>
                                    <div className="flex items-center gap-1.5 text-[11px] text-subtext font-medium">
                                        <User className="w-3 h-3 opacity-50" />
                                        <span>{report.user}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1 border-t border-border/10">
                                    <div className="flex items-center gap-1.5 text-[10px] text-subtext font-bold uppercase tracking-widest">
                                        <Clock className="w-3 h-3" />
                                        {new Date(report.date).toLocaleDateString()}
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black border ${getStatusColor(report.status)} uppercase shadow-sm`}>{t(report.status?.toLowerCase())}</span>
                                </div>

                                {report.priority === 'high' && (
                                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full shadow-lg shadow-primary/40" />
                                )}
                            </div>
                        ))}
                        {filteredReports.length === 0 && (
                            <div className="p-12 text-center">
                                <MessageSquare className="w-8 h-8 mx-auto mb-3 text-subtext/20" />
                                <p className="text-subtext text-xs font-bold uppercase tracking-wider">{t("admin.support.noInquiries")}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Report Details */}
                <div className={`lg:col-span-2 bg-card border border-border rounded-2xl flex flex-col shadow-sm overflow-hidden h-full lg:h-[600px] ${!selectedReport ? 'hidden lg:flex' : 'flex'}`}>
                    {selectedReport ? (
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="p-6 border-b border-border bg-secondary/50 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        {/* Mobile Back Button */}
                                        <button
                                            onClick={() => setSelectedReport(null)}
                                            className="lg:hidden p-1.5 -ml-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-subtext"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${selectedReport.origin === 'report' ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'}`}>{t(selectedReport.origin?.toLowerCase())}</span>
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${reportFilterTypeColor(selectedReport.type)}`}>{t(selectedReport.type?.toLowerCase().replace(' ', '_')) || selectedReport.type}</span>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(selectedReport.status)}`}>{t(selectedReport.status?.toLowerCase())}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-maintext mb-1">{selectedReport.title.length > 50 ? selectedReport.title.substring(0, 50) + '...' : selectedReport.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-subtext">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{t("admin.support.submittedOn")} {new Date(selectedReport.date).toLocaleString()}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteClick(e, selectedReport)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-primary/20 transition-all border border-primary/20 active:scale-95 shadow-sm"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    {t("admin.agents.delete")}
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Sender Profile Card */}
                                <div className="bg-secondary/30 border border-border rounded-xl p-5">
                                    <h4 className="text-xs font-bold text-subtext uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <User className="w-4 h-4" /> {t("admin.support.senderDetails")}
                                    </h4>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                                                {selectedReport.user.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] md:text-xs text-subtext mb-0.5">{t('sender_name')}</p>
                                                <p className="font-bold text-maintext text-sm truncate">{selectedReport.user}</p>
                                            </div>
                                        </div>

                                        <div className="sm:pl-6 sm:border-l border-border min-w-0">
                                            <p className="text-[10px] md:text-xs text-subtext mb-0.5">{t("sender_email")}</p>
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <p className="font-bold text-primary text-sm md:text-base select-all truncate">{selectedReport.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Message Content */}
                                <div>
                                    <h4 className="text-xs font-bold text-subtext uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" /> {t("admin.support.messageContent")}
                                    </h4>
                                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                                        {selectedReport.subject && (
                                            <div className="mb-4 pb-4 border-b border-border">
                                                <p className="text-xs text-subtext mb-1">{t("admin.support.subject")}</p>
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
                                    <h4 className="text-sm font-bold text-maintext mb-3">{t("admin.support.resolutionNotes")}</h4>
                                    <textarea
                                        className="w-full bg-card border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none min-h-[100px] mb-4 text-maintext placeholder-subtext/50"
                                        placeholder={t("admin.support.notesPlaceholder")}
                                        value={resolutionNote}
                                        onChange={(e) => setResolutionNote(e.target.value)}
                                    />
                                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                        <button
                                            disabled={isResolving}
                                            onClick={() => handleResolve('in-progress')}
                                            className="bg-primary/10 text-primary border border-primary/20 px-5 py-2 rounded-xl text-sm font-bold hover:bg-primary/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isResolving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                            {t("admin.support.send")}
                                        </button>
                                        {selectedReport.status !== 'resolved' && (
                                            <button
                                                disabled={isResolving}
                                                onClick={() => handleResolve('resolved')}
                                                className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {isResolving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                {t("admin.support.markResolved")}
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
                            <p className="font-medium text-lg">{t("admin.support.selectTicket")}</p>
                            <p className="text-sm">{t("admin.support.selectTicketDesc")}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-md rounded-2xl md:rounded-[32px] overflow-hidden shadow-2xl border border-border animate-in zoom-in duration-300">
                        <div className="p-6 md:p-8 text-center">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                                <Trash2 className="w-8 h-8 md:w-10 md:h-10 text-primary animate-bounce" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-maintext mb-2 tracking-tight">{t("admin.support.deleteConfirmTitle")}</h3>
                            <p className="text-subtext text-xs md:text-sm leading-relaxed px-4">
                                {t("admin.support.deleteConfirmMessage").replace('{title}', deleteModal.report?.title?.substring(0, 30) + (deleteModal.report?.title?.length > 30 ? '...' : ''))}
                            </p>

                            <div className="mt-6 md:mt-10 grid grid-cols-2 gap-3 md:gap-4">
                                <button
                                    onClick={() => setDeleteModal({ show: false, report: null })}
                                    className="px-4 py-3 md:px-6 md:py-4 bg-secondary text-maintext rounded-xl md:rounded-2xl text-xs md:text-sm font-bold hover:bg-border transition-all active:scale-95"
                                >
                                    {t("admin.agents.cancel")}
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="px-4 py-3 md:px-6 md:py-4 bg-primary text-white rounded-xl md:rounded-2xl text-xs md:text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : t("admin.support.confirmDelete")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSupport;
