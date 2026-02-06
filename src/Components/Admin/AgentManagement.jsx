import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Loader2, Edit2, EyeOff, Trash2, AlertCircle } from 'lucide-react';
import apiService from '../../services/apiService';
import CreateAppModal from './CreateAppModal';
import AppDetails from './AppDetails';

const AgentManagement = ({ onDetailView }) => {
    const { t } = useLanguage();
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [newAppName, setNewAppName] = useState('');
    const [selectedApp, setSelectedApp] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [agentToDelete, setAgentToDelete] = useState(null);
    const bottomRef = useRef(null);

    // Sync onDetailView state with selectedApp
    useEffect(() => {
        if (onDetailView) {
            onDetailView(!!selectedApp);
        }
    }, [selectedApp, onDetailView]);

    const fetchStats = async () => {
        console.log("Starting fetchStats...");
        try {
            console.log("Calling apiService.getAdminOverviewStats()...");
            const data = await apiService.getAdminOverviewStats();
            console.log("Data received:", data);
            setStatsData(data);
        } catch (err) {
            console.error("Failed to fetch admin overview stats/inventory:", err);
        } finally {
            console.log("Setting loading to false");
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("AgentManagement mounted");
        fetchStats();
    }, []);

    const handleCreateApp = async (agentData) => {
        console.log("Creating new agent with data:", agentData);
        try {
            // Map agentUrl to url if necessary
            const payload = {
                ...agentData,
                url: agentData.url || agentData.agentUrl
            };
            const newApp = await apiService.createAgent(payload);
            console.log("New Agent Created Successfully:", newApp);
            setNewAppName(newApp.agentName || newApp.name || 'New Agent');
            setShowSuccess(true);
            await fetchStats();
            // Auto-scroll to bottom after list refresh
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        } catch (err) {
            console.error("Failed to create agent:", err);
        }
    };

    const handleDeleteClick = (app, e) => {
        e.stopPropagation();
        setAgentToDelete(app);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!agentToDelete) return;

        try {
            await apiService.deleteAgent(agentToDelete.id, true); // Hard delete
            setShowDeleteConfirm(false);
            setAgentToDelete(null);
            await fetchStats();
        } catch (err) {
            console.error("Failed to delete agent:", err);
            // Optionally show error state here
        }
    };

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (selectedApp) {
        return (
            <AppDetails
                app={selectedApp}
                onBack={() => setSelectedApp(null)}
                onDelete={() => {
                    fetchStats();
                    setSelectedApp(null);
                }}
                onUpdate={() => fetchStats()}
                isAdmin={true}
            />
        );
    }

    return (
        <div className="space-y-10 pb-12 relative">
            {/* Delete Confirmation Modal Overlay */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white border border-blue-500/10 rounded-2xl md:rounded-[32px] p-6 md:p-8 max-w-sm w-full shadow-2xl shadow-blue-500/10 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-2 shadow-inner shadow-blue-500/20">
                                <AlertCircle className="w-8 h-8 text-blue-500" />
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{t("notificationsPage.delete")}?</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Are you sure you want to permanently delete <span className="text-slate-900 font-semibold">"{agentToDelete?.name}"</span>? This action cannot be undone.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 w-full mt-2">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-sm transition-colors"
                                >
                                    {t("chatPage.cancel")}
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95"
                                >
                                    {t("notificationsPage.delete")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-maintext">{t("admin.sidebar.agents")}</h1>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-400/30 rounded-[20px] p-2.5 flex items-center justify-between animate-in slide-in-from-top-full duration-500 shadow-2xl shadow-blue-500/40 backdrop-blur-xl">
                    <div className="flex items-center gap-2.5">
                        <div>
                            <h3 className="text-xs font-bold text-white leading-tight">Success!</h3>
                            <p className="text-[10px] font-medium text-blue-100/90 leading-tight">
                                {t("admin.sidebar.agents")} <span className="font-extrabold text-white">"{newAppName}"</span> created.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowSuccess(false)}
                        className="ml-4 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-[9px] transition-all hover:scale-105 active:scale-95 border border-white/10 shrink-0"
                    >
                        Dismiss
                    </button>
                </div>
            )}


            {/* Your Apps Card */}
            <div className="bg-card border border-border rounded-2xl md:rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 md:p-6 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h4 className="text-lg md:text-xl font-bold text-maintext">{t("admin.sidebar.agents")}</h4>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-2xl text-xs font-bold hover:shadow-xl hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 border border-blue-400/20 backdrop-blur-md"
                    >
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-sm font-bold leading-none mb-0.5">+</span>
                        </div>
                        {t("myAgentsPage.createNew")}
                    </button>
                </div>

                <div className="bg-card border border-border rounded-xl md:rounded-3xl shadow-sm overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-secondary text-[10px] text-subtext font-bold uppercase tracking-wider">
                                    <th className="px-4 md:px-8 py-5">{t("admin.sidebar.agents")}</th>
                                    <th className="px-4 md:px-8 py-5">{t("billing")}</th>
                                    <th className="px-4 md:px-8 py-5 text-center">{t("admin.overview.status")}</th>
                                    <th className="px-4 md:px-8 py-5 text-right">{t("notificationsPage.delete")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {statsData?.inventory?.length > 0 ? (
                                    statsData.inventory.map((app) => (
                                        <tr
                                            key={app.id}
                                            onClick={() => setSelectedApp(app)}
                                            className="hover:bg-secondary transition-colors group cursor-pointer"
                                        >
                                            <td className="px-4 md:px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-maintext">{app.name || 'Unnamed Agent'}</span>
                                                    <span className="text-[10px] text-subtext mt-0.5">ID: {app.id?.substring(0, 8)}...</span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-8 py-5 text-sm font-medium text-subtext">
                                                <div className="flex flex-col gap-1">
                                                    <span>{t(app.pricing?.toLowerCase()) || app.pricing || t('free')}</span>
                                                    {app.reviewStatus && app.reviewStatus !== 'Approved' && (
                                                        <span className={`text-[10px] font-bold uppercase ${app.reviewStatus === 'Pending Review' ? 'text-blue-600 dark:text-blue-400' : 'text-subtext'}`}>
                                                            {t(app.reviewStatus?.toLowerCase().replace(' ', '_')) || app.reviewStatus}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-8 py-5 text-center">
                                                <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${app.status === 'Live' || app.status === 'Active'
                                                    ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-600/20'
                                                    : 'bg-secondary text-subtext border-border'
                                                    }`}>
                                                    {t(app.status?.toLowerCase()) || app.status || t('inactive')}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={(e) => handleDeleteClick(app, e)}
                                                        className="p-1.5 md:p-2 hover:bg-secondary rounded-lg text-subtext hover:text-blue-600 transition-colors"
                                                        title="Permanently Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                                                    <Shield className="w-6 h-6 text-subtext/20" />
                                                </div>
                                                <p className="text-subtext font-bold text-sm tracking-wide">No agents found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-border/50">
                        {statsData?.inventory?.length > 0 ? (
                            statsData.inventory.map((app) => (
                                <div
                                    key={app.id}
                                    onClick={() => setSelectedApp(app)}
                                    className="p-4 space-y-4 hover:bg-secondary transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-maintext text-sm leading-tight">{app.name || 'Unnamed Agent'}</span>
                                            <span className="text-[10px] text-subtext mt-0.5">ID: {app.id?.substring(0, 8)}...</span>
                                        </div>
                                        <button
                                            onClick={(e) => handleDeleteClick(app, e)}
                                            className="p-2 text-red-500/60 hover:text-red-500 bg-secondary/50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-subtext uppercase tracking-widest">{t("admin.overview.status")}</p>
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${app.status === 'Live' || app.status === 'Active'
                                                ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-600/20'
                                                : 'bg-secondary text-subtext border-border'
                                                }`}>
                                                {t(app.status?.toLowerCase()) || app.status || t('inactive')}
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <p className="text-[9px] font-black text-subtext uppercase tracking-widest">{t("billing")}</p>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-maintext text-xs">{t(app.pricing?.toLowerCase()) || app.pricing || t('free')}</span>
                                                {app.reviewStatus && app.reviewStatus !== 'Approved' && (
                                                    <span className={`text-[8px] font-black uppercase tracking-tighter ${app.reviewStatus === 'Pending Review' ? 'text-blue-600' : 'text-subtext/60'}`}>
                                                        {t(app.reviewStatus?.toLowerCase().replace(' ', '_')) || app.reviewStatus}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <Shield className="w-10 h-10 mx-auto mb-3 text-subtext/10" />
                                <p className="text-subtext font-bold text-xs tracking-wide">No agents found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div ref={bottomRef} className="h-4" />

            <CreateAppModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateApp}
            />
        </div>
    );
};

export default AgentManagement;
