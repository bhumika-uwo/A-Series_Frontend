import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AlertCircle, Server, ShieldAlert, ToggleLeft, ToggleRight, Settings, Save, Loader2, Info } from 'lucide-react';
import apiService from '../../services/apiService';
import { useToast } from '../Toast/ToastContext';

const PlatformSettings = () => {
    const { t } = useLanguage();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [settings, setSettings] = useState({
        platformName: 'A-Series™',
        contactEmail: 'admin@uwo24.com',
        maintenanceMode: false,
        killSwitch: false,
        maxTokensPerUser: 1000000
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await apiService.getAdminSettings();
            setSettings(data);
        } catch (err) {
            console.error("Failed to load settings", err);
            toast.error(t("admin.platformSettings.toastLoadError"));
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await apiService.updateAdminSettings(settings);
            toast.success(t("admin.platformSettings.toastSaved"));
        } catch (err) {
            console.error("Failed to save settings", err);
            toast.error(t("admin.platformSettings.toastError"));
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-maintext">{t("admin.platformSettings.title")}</h2>
                    <p className="text-xs md:text-sm text-subtext mt-1">{t("admin.platformSettings.subtitle")}</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {t("admin.platformSettings.saveChanges")}
                </button>
            </div>

            {/* General Config Card */}
            <div className="bg-card border border-border rounded-2xl p-5 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Settings className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base md:text-lg font-bold text-maintext">{t("admin.platformSettings.generalConfig")}</h3>
                        <p className="text-[10px] md:text-xs text-subtext">{t("admin.platformSettings.generalSubtitle")}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group">
                        <label className="block text-[10px] md:text-xs font-bold text-primary uppercase tracking-wider mb-2 ml-1">{t("admin.platformSettings.supportPhone") || 'Support Phone'}</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="supportPhone"
                                value={settings.supportPhone || ''}
                                onChange={handleChange}
                                placeholder="+91 00000 00000"
                                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm font-bold text-maintext outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-subtext/30"
                            />
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-[10px] md:text-xs font-bold text-primary uppercase tracking-wider mb-2 ml-1">{t("admin.platformSettings.contactEmail")}</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="contactEmail"
                                value={settings.contactEmail || ''}
                                onChange={handleChange}
                                placeholder="admin@uwo24.com"
                                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm font-bold text-maintext outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-subtext/30"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 group">
                    <label className="block text-[10px] md:text-xs font-bold text-primary uppercase tracking-wider mb-2 ml-1">{t("admin.platformSettings.globalAnnouncement") || 'Global Announcement'}</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="announcement"
                            value={settings.announcement || ''}
                            onChange={handleChange}
                            placeholder={t("admin.platformSettings.announcementPlaceholder")}
                            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm font-medium text-maintext outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-subtext/30"
                        />
                        <p className="text-[10px] text-subtext/60 mt-2 ml-1">{t("admin.platformSettings.announcementHint")}</p>
                    </div>
                </div>
            </div>

            {/* Safety & Emergency Card */}
            <div className="bg-card border border-border rounded-2xl p-5 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base md:text-lg font-bold text-maintext">{t("admin.platformSettings.safetyEmergency")}</h3>
                        <p className="text-[10px] md:text-xs text-subtext">{t("admin.platformSettings.safetySubtitle")}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Maintenance Mode Toggle */}
                    <div className="flex items-center justify-between p-4 md:p-5 bg-secondary/50 rounded-xl border border-border hover:border-primary/20 transition-colors group">
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                            <div className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center transition-colors shrink-0 ${settings.maintenanceMode ? 'bg-primary/20 text-primary' : 'bg-card text-subtext border border-border'}`}>
                                <Server className="w-4.5 h-4.5" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-maintext text-sm md:text-base truncate">{t("admin.platformSettings.maintenanceMode")}</p>
                                <p className="text-[10px] md:text-xs text-subtext font-medium mt-0.5 md:mt-1 truncate">{t("admin.platformSettings.maintenanceDesc")}</p>
                            </div>
                        </div>
                        <button onClick={() => toggleSetting('maintenanceMode')} className={`text-2xl md:text-3xl transition-all transform active:scale-95 shrink-0 ${settings.maintenanceMode ? 'text-primary' : 'text-subtext/30 hover:text-subtext/50'}`}>
                            {settings.maintenanceMode ? <ToggleRight className="w-7 h-7 md:w-8 md:h-8" /> : <ToggleLeft className="w-7 h-7 md:w-8 md:h-8" />}
                        </button>
                    </div>

                    {/* Kill Switch Toggle */}
                    <div className={`flex items-center justify-between p-4 md:p-5 rounded-xl border transition-all duration-300 ${settings.killSwitch ? 'bg-primary/5 border-primary/20 shadow-inner' : 'bg-secondary/50 border-border hover:border-primary/20'}`}>
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                            <div className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center transition-colors shrink-0 ${settings.killSwitch ? 'bg-red-500 text-white' : 'bg-card text-subtext border border-border'}`}>
                                <AlertCircle className="w-4.5 h-4.5" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-maintext text-sm md:text-base truncate">{t("admin.platformSettings.killSwitch")}</p>
                                <p className="text-[10px] md:text-xs text-subtext font-medium mt-0.5 md:mt-1 truncate">{t("admin.platformSettings.killSwitchDesc")}</p>
                            </div>
                        </div>
                        <button onClick={() => toggleSetting('killSwitch')} className={`text-2xl md:text-3xl transition-all transform active:scale-95 shrink-0 ${settings.killSwitch ? 'text-red-500' : 'text-subtext/30 hover:text-primary/30'}`}>
                            {settings.killSwitch ? <ToggleRight className="w-7 h-7 md:w-8 md:h-8" /> : <ToggleLeft className="w-7 h-7 md:w-8 md:h-8" />}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PlatformSettings;
