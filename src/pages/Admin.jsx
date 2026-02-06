import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useLanguage } from "../context/LanguageContext";
import {
  Activity,
  Users,
  ShoppingBag,
  DollarSign,
  Shield,
  AlertTriangle,
  CheckCircle,
  Settings,
  UserCheck,
  ChevronDown,
  ChevronUp,
  FileText,
  Menu,
  X
} from "lucide-react";

// Sub-Components
// Sub-Components
import AdminOverview from "../Components/Admin/AdminOverview";

import UserManagement from "../Components/Admin/UserManagement";

import AgentManagement from "../Components/Admin/AgentManagement";
import Financials from "../Components/Admin/Financials";
import TransactionHistory from "../Components/Admin/TransactionHistory";
import Complaints from "../Components/Admin/Complaints";

import PlatformSettings from "../Components/Admin/PlatformSettings";
import AdminSupport from "../Components/Admin/Support";
import { ArrowLeft } from "lucide-react";

const Admin = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSubTab, setActiveSubTab] = useState("overview");
  const [isRevenueExpanded, setIsRevenueExpanded] = useState(true);
  const [isDetailView, setIsDetailView] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navigation = {
    management: [
      { id: "overview", label: t("admin.sidebar.overview"), icon: Activity },
      { id: "agents", label: t("admin.sidebar.agents"), icon: ShoppingBag },
      {
        id: "finance",
        label: t("admin.sidebar.revenue"),
        icon: DollarSign,
        hasSub: true,
        subItems: [
          { id: "overview", label: t("admin.sidebar.overview") },
          { id: "transactions", label: t("admin.sidebar.transactions") }
        ]
      },
      { id: "complaints", label: t("admin.sidebar.userSupport"), icon: AlertTriangle },
      { id: "users", label: t("admin.sidebar.userManagement"), icon: Users },

    ],
    governance: [
      { id: "settings", label: t("admin.sidebar.settings"), icon: Settings },
    ]
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <AdminOverview onDetailView={setIsDetailView} />;

      case "users": return <UserManagement onDetailView={setIsDetailView} />;

      case "agents": return <AgentManagement onDetailView={setIsDetailView} />;
      case "finance":
        return activeSubTab === "transactions" ? <TransactionHistory onDetailView={setIsDetailView} /> : <Financials onDetailView={setIsDetailView} />;
      case "complaints": return <AdminSupport onDetailView={setIsDetailView} />;

      case "settings": return <PlatformSettings onDetailView={setIsDetailView} />;
      default: return <AdminOverview onDetailView={setIsDetailView} />;
    }
  };

  const NavItem = ({ item }) => {
    const isMainActive = activeTab === item.id;

    return (
      <div className="space-y-1">
        <button
          onClick={() => {
            setActiveTab(item.id);
            if (item.hasSub) {
              setIsRevenueExpanded(!isRevenueExpanded);
            }
            // Close mobile sidebar when item is clicked
            setIsMobileSidebarOpen(false);
          }}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-bold ${isMainActive
            ? "bg-primary/5 text-primary"
            : "text-subtext hover:bg-secondary hover:text-maintext"
            }`}
        >
          <div className="flex items-center gap-3">
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </div>
          {item.hasSub && (isRevenueExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
        </button>

        {item.hasSub && isRevenueExpanded && (
          <div className="pl-11 space-y-1">
            {item.subItems.map(sub => (
              <button
                key={sub.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setActiveSubTab(sub.id);
                  // Close mobile sidebar when sub-item is clicked
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${isMainActive && activeSubTab === sub.id
                  ? "text-primary bg-primary/5"
                  : "text-subtext hover:text-maintext hover:bg-secondary"
                  }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex bg-secondary text-maintext overflow-hidden relative">
      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive with mobile overlay */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[280px] sm:w-72 lg:w-64 border-r border-border bg-card flex-col shrink-0
        transform transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex
      `}>
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
              M
            </div>
            <span className="font-bold text-xl tracking-tight">ADMIN</span>
          </div>
          {/* Close button - Mobile only */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-subtext" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-8 py-4">
          <div>
            <p className="text-[10px] font-bold text-subtext uppercase tracking-[2px] mb-4 px-4 opacity-50">{t("admin.sidebar.management")}</p>
            <div className="space-y-1">
              {navigation.management.map(item => <NavItem key={item.id} item={item} />)}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-subtext uppercase tracking-[2px] mb-4 px-4 opacity-50">{t("admin.sidebar.governance")}</p>
            <div className="space-y-1">
              {navigation.governance.map(item => <NavItem key={item.id} item={item} />)}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-subtext hover:text-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("admin.sidebar.goToASeries")}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
        {/* Header */}
        <header className="h-[64px] md:h-[72px] bg-card border-b border-border flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            {/* Hamburger Menu - Mobile Only */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors -ml-2"
            >
              <Menu className="w-5 h-5 text-maintext" />
            </button>

            {!isDetailView ? (
              <div className="flex-1" />
            ) : (
              <div className="flex items-center gap-2 text-subtext text-xs font-bold uppercase tracking-widest">
                <Activity className="w-4 h-4" />
                <span>{t("admin.header.config")}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">


            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-maintext">{t('brandName')}</p>

              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm border border-primary/10">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto bg-secondary p-4 md:p-8 scroll-smooth">
          <div className="max-w-[1400px] mx-auto pb-20 md:pb-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;