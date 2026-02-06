import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DollarSign, TrendingUp, CreditCard, Loader2, Copy, Check } from 'lucide-react';
import apiService from '../../services/apiService';

const Financials = () => {
    const { t } = useLanguage();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    const fetchData = async () => {
        try {
            const stats = await apiService.getAdminRevenueStats();
            setData(stats);
        } catch (err) {
            console.error("Failed to load financials", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // 30s refresh
        return () => clearInterval(interval);
    }, []);

    const handleCopy = (id, text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    const overview = data?.overview || { totalGross: 0, totalVendorPayouts: 0, totalPlatformNet: 0 };
    const apps = data?.appPerformance || [];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    const Card = ({ id, title, amount, subtitle, icon: Icon, colorClass, borderClass, bgClass, iconBgClass }) => (
        <div
            onClick={() => handleCopy(id, formatCurrency(amount))}
            className={`
                group relative overflow-hidden
                ${bgClass} ${borderClass} rounded-2xl p-5 md:p-6 shadow-sm 
                cursor-pointer transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02]
                active:scale-95 active:bg-opacity-90
            `}
        >
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                    <p className={`text-[10px] md:text-[11px] font-bold ${colorClass === 'text-white' ? 'text-blue-100' : 'text-subtext'} uppercase tracking-wider transition-colors`}>{title}</p>
                    <h3 className={`text-2xl md:text-3xl font-bold ${colorClass === 'text-white' ? 'text-white' : colorClass} mt-1 transition-all`}>
                        {copiedId === id ? (
                            <span className="flex items-center gap-2 text-xs md:text-sm animate-in fade-in zoom-in">
                                <Check className="w-4 h-4 md:w-5 md:h-5" /> {t("chatPage.codeCopied")}
                            </span>
                        ) : (
                            formatCurrency(amount)
                        )}
                    </h3>
                </div>
                <div className={`
                    w-10 h-10 ${iconBgClass} rounded-xl flex items-center justify-center 
                    transition-all duration-500 ease-out 
                    group-hover:rotate-12 group-hover:scale-110 group-hover:bg-opacity-80
                `}>
                    <Icon className={`w-5 h-5 ${colorClass === 'text-white' ? 'text-white' : colorClass.replace('text-', 'text-')}`} />
                </div>
            </div>
            <p className={`text-xs ${colorClass === 'text-white' ? 'text-blue-100/70' : 'text-subtext'} font-medium relative z-10 group-hover:translate-x-1 transition-transform`}>{subtitle}</p>

            {/* Hover Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${colorClass === 'text-white' ? 'from-white/10 to-transparent' : 'from-primary/5 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
        </div>
    );

    return (
        <div className="space-y-8 font-sans">
            <div>
                <h2 className="text-2xl font-bold text-maintext">{t("admin.finance.revenueOverview")}</h2>
                <p className="text-subtext text-sm">{t("admin.finance.platformPerformance")}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card
                    id="gross"
                    title={t("admin.finance.totalGross")}
                    amount={overview.totalGross}
                    subtitle={t("admin.finance.grossSubtitle")}
                    icon={TrendingUp}
                    colorClass="text-maintext"
                    bgClass="bg-card"
                    borderClass="border border-border"
                    iconBgClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                />

                <Card
                    id="costs"
                    title={t("admin.finance.operationalCosts")}
                    amount={overview.totalVendorPayouts} // reusing value for demo, logically would be different
                    subtitle={t("admin.finance.costsSubtitle")}
                    icon={CreditCard}
                    colorClass="text-maintext"
                    bgClass="bg-card"
                    borderClass="border border-border"
                    iconBgClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                />

                <Card
                    id="net"
                    title={t("admin.finance.netPlatform")}
                    amount={overview.totalPlatformNet}
                    subtitle={t("admin.finance.netSubtitle")}
                    icon={DollarSign}
                    colorClass="text-primary"
                    bgClass="bg-blue-500/10"
                    borderClass="border border-primary/20"
                    iconBgClass="bg-primary/10 text-primary"
                />
            </div>

            {/* App-wise Performance Table */}
            <div className="bg-card border border-border rounded-2xl md:rounded-[32px] overflow-hidden shadow-sm">
                <div className="p-4 md:p-6 border-b border-border flex items-center justify-between">
                    <h3 className="text-base md:text-lg font-bold text-maintext">{t("admin.finance.agentPerformance")}</h3>
                    <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-wider text-subtext/50">
                        Live Metrics
                    </div>
                </div>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-secondary text-[10px] text-subtext font-bold uppercase tracking-wider">
                                <th className="px-4 md:px-8 py-5">{t("admin.sidebar.agents")}</th>
                                <th className="px-4 md:px-8 py-5 text-right">{t("admin.finance.totalRevenue")}</th>
                                <th className="px-4 md:px-8 py-5 text-right">{t("admin.finance.vendorShare")}</th>
                                <th className="px-4 md:px-8 py-5 text-right font-black">{t("admin.finance.platformNet")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {apps.length > 0 ? (
                                apps.map((app) => (
                                    <tr key={app.id} className="hover:bg-secondary transition-colors group">
                                        <td className="px-4 md:px-8 py-5">
                                            <span className="text-sm font-bold text-maintext group-hover:text-primary transition-colors">{app.name}</span>
                                        </td>
                                        <td className="px-4 md:px-8 py-5 text-right text-xs md:text-sm font-medium text-subtext">{formatCurrency(app.totalRevenue)}</td>
                                        <td className="px-4 md:px-8 py-5 text-right text-xs md:text-sm font-bold text-slate-500">{formatCurrency(app.vendorEarnings)}</td>
                                        <td className="px-4 md:px-8 py-5 text-right text-xs md:text-sm font-black text-primary bg-primary/5">{formatCurrency(app.platformFees)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <p className="text-sm text-subtext italic">{t("chatPage.noRecentChats")}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-border/50">
                    {apps.length > 0 ? (
                        apps.map((app) => (
                            <div key={app.id} className="p-4 space-y-3 hover:bg-secondary transition-colors">
                                <h4 className="font-bold text-maintext text-sm">{app.name}</h4>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-subtext uppercase tracking-widest">{t("admin.finance.totalRevenue")}</p>
                                        <p className="font-bold text-maintext text-xs">{formatCurrency(app.totalRevenue)}</p>
                                    </div>
                                    <div className="space-y-1 text-center">
                                        <p className="text-[9px] font-black text-subtext uppercase tracking-widest">{t("admin.finance.vendorShare")}</p>
                                        <p className="font-bold text-slate-500 text-xs">{formatCurrency(app.vendorEarnings)}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">{t("admin.finance.platformNet")}</p>
                                        <p className="font-black text-primary text-xs">{formatCurrency(app.platformFees)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center">
                            <p className="text-subtext font-bold text-xs">{t("chatPage.noRecentChats")}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Financials;
