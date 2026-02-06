import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Users, ShoppingBag, AlertTriangle, DollarSign, Loader2 } from 'lucide-react';
import apiService from '../../services/apiService';
import CreateAppModal from './CreateAppModal';

const AdminOverview = () => {
    const { t } = useLanguage();
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchStats = async () => {
        try {
            const data = await apiService.getAdminOverviewStats();
            setStatsData(data);
        } catch (err) {
            console.error("Failed to fetch admin overview stats:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // Refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleCreateApp = async (formData) => {
        try {
            // Map agentUrl to url for backend compatibility
            const payload = {
                ...formData,
                url: formData.agentUrl,
                pricingModel: formData.pricing,
                pricing: formData.pricingConfig ? {
                    type: 'Subscription',
                    plans: formData.pricingConfig.plans.map(planName => ({
                        name: planName,
                        price: formData.pricingConfig.prices[planName] || {},
                        currency: formData.pricingConfig.currency,
                        billingCycle: formData.pricingConfig.billingCycle
                    }))
                } : {
                    type: formData.pricing === 'Free' ? 'Free' : 'Paid',
                    plans: [formData.pricing]
                }
            };
            delete payload.agentUrl;
            delete payload.pricingConfig; // Remove temporary field

            await apiService.createAgent(payload);
            await fetchStats(); // Refresh list
        } catch (error) {
            console.error("Error creating agent:", error);
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    const snapshot = [
        { label: t("admin.overview.totalUsers"), value: statsData?.totalUsers?.toLocaleString() || '0', trend: '0%', direction: 'neutral' },
        { label: t("admin.overview.activeAgents"), value: statsData?.activeAgents?.toLocaleString() || '0', trend: '0%', direction: 'neutral' },
        { label: t("admin.overview.revenueMtd"), value: `₹${(statsData?.financials?.grossSales || 0).toLocaleString()}`, trend: '0%', direction: 'neutral' },
    ];

    return (
        <div className="space-y-10 pb-12">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-maintext">{t("admin.overview.title")}</h1>
                    <p className="text-sm md:text-base text-subtext mt-1">{t("admin.overview.welcome")}</p>
                </div>

            </div>

            {/* Main Status Card */}
            <div className="bg-card border border-border rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm gap-6">
                <div className="flex items-center gap-4 md:gap-8">
                    <div>
                        <h2 className="text-lg md:text-2xl font-bold text-gray-800">{t("admin.overview.systemsOperational")}</h2>
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1 md:mt-2">
                            <span className="px-2 md:px-3 py-0.5 md:py-1 bg-secondary text-subtext rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">{t("admin.overview.systemReady")}</span>
                            <div className="hidden md:block w-1 h-1 bg-border rounded-full" />
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary rounded-full" />
                                <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-wider">{t("admin.overview.production")}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 md:gap-12 md:border-l md:border-border md:pl-12 w-full md:w-auto">
                    <div className="flex items-center gap-3">
                        <div>
                            <p className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t("admin.overview.security")}</p>
                            <div className="flex items-center gap-2">
                                <p className="text-xs md:text-sm font-bold text-gray-800">{t("admin.overview.systemSecure")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Snapshot */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-primary rounded-full" />
                    <h3 className="text-[11px] font-extrabold text-maintext uppercase tracking-[2px]">{t("admin.overview.performanceSnapshot")}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {snapshot.map((item, index) => (
                        <div key={index} className="bg-card border border-border rounded-2xl p-5 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2 md:mb-4 text-subtext">
                                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider leading-none">{item.label}</span>
                            </div>
                            <h4 className="text-2xl md:text-4xl font-bold text-maintext">{item.value}</h4>
                        </div>
                    ))}
                </div>
            </div>

            {/* Financial Overview */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-primary rounded-full" />
                    <h3 className="text-[11px] font-extrabold text-maintext uppercase tracking-[2px]">{t("admin.overview.financialOverview")}</h3>
                </div>

                <div className="bg-card border border-border rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2 text-blue-600 font-extrabold text-sm tracking-widest">
                            {t("admin.overview.financialOverview").toUpperCase()}
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1 hover:underline group">
                                {t("admin.overview.invoice")}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl transition-all hover:bg-white hover:shadow-md group">
                            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-2 transition-colors group-hover:text-blue-600">{t("admin.overview.grossSales")}</p>
                            <h4 className="text-3xl font-extrabold text-gray-800 tracking-tight">₹{(statsData?.financials?.grossSales || 0).toLocaleString()}</h4>
                        </div>
                        <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl transition-all hover:bg-white hover:shadow-md group">
                            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-2 transition-colors group-hover:text-blue-600">{t("admin.overview.platformFee")}</p>
                            <h4 className="text-3xl font-extrabold text-gray-800 tracking-tight">₹{(statsData?.financials?.platformFee || 0).toLocaleString()}</h4>
                        </div>
                        <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl transition-all hover:bg-white hover:shadow-md group">
                            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-2 transition-colors group-hover:text-blue-600">{t("admin.overview.netEarnings")}</p>
                            <h4 className="text-3xl font-extrabold text-gray-800 tracking-tight">₹{(statsData?.financials?.netEarnings || 0).toLocaleString()}</h4>
                        </div>
                        <div className="p-6 flex flex-col justify-center">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">{t("admin.overview.status")}</p>
                            <span className="w-fit px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-extrabold border border-blue-200 mb-3">{statsData?.financials?.status || t("admin.overview.active")}</span>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">{t("admin.overview.nextPayout")}</p>
                            <p className="text-sm font-bold text-gray-800">{statsData?.financials?.nextPayout || '15th Oct 2024'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <CreateAppModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateApp}
            />
        </div>
    );
};

export default AdminOverview;
