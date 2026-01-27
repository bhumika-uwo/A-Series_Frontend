import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import {
  User,
  LayoutGrid,
  MessageSquare,
  ShoppingBag,
  Bot,
  Settings,
  LogOut,
  Zap,
  X,
  FileText,
  Bell,

  DollarSign,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import HelpFAQModal from '../Help/HelpFAQModal.jsx';
import { apis, AppRoute } from '../../types';
import { faqs } from '../../constants'; // Import shared FAQs
import NotificationBar from '../NotificationBar/NotificationBar.jsx';
import { useRecoilState } from 'recoil';
import { clearUser, getUserData, setUserData, toggleState, userData, notificationsState } from '../../userStore/userData';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { t, language, region, regionFlags } = useLanguage();
  const { theme, setTheme } = useTheme();


  const getFlagUrl = (code) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

  const navigate = useNavigate();
  const [notifiyTgl, setNotifyTgl] = useRecoilState(toggleState)
  const [currentUserData, setUserRecoil] = useRecoilState(userData);
  const [notifications, setNotifications] = useRecoilState(notificationsState);
  const user = currentUserData.user || getUserData() || { name: "Loading...", email: "...", role: "user" };
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  const issueOptions = [
    "General Inquiry",
    "Payment Issue",
    "Refund Request",
    "Technical Support",
    "Account Access",
    "Other"
  ];


  const handleLogout = () => {
    localStorage.clear();
    navigate(AppRoute.LANDING);
  };
  const token = user?.token || localStorage.getItem('token')

  useEffect(() => {
    // User data
    if (token) {
      axios.get(apis.user, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then((res) => {
        if (res.data) {
          setUserRecoil({ user: res.data });
          setUserData(res.data);
        }
      }).catch((err) => {
        console.error(err);
        if (err.status == 401) {
          clearUser()
          navigate(AppRoute.LOGIN)
        }
      })
    }

    // Notifications
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(apis.notifications, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setNotifications(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Notifications fetch failed", err);
      }
    };

    if (token) {
      fetchNotifications();
      // Refresh every 5 seconds for "real-time" feel
      const interval = setInterval(fetchNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, [token])
  if (notifiyTgl.notify) {
    setTimeout(() => {
      setNotifyTgl({ notify: false })
    }, 2000)
  }
  // Dynamic class for active nav items
  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium border border-transparent ${isActive
      ? 'bg-primary/10 text-primary border-primary/10'
      : 'text-subtext hover:bg-surface hover:text-maintext'
    }`;



  return (
    <>
      <AnimatePresence>
        {notifiyTgl.notify && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className='fixed w-full z-10 flex justify-center items-center mt-5 ml-6'
          >
            <NotificationBar msg={"Successfully Owned"} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for Mobile/Tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-[100] w-full sm:w-72 lg:w-64 bg-secondary border-r border-border 
          flex flex-col transition-transform duration-300 ease-in-out 
          lg:relative lg:translate-x-0 shadow-2xl lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand */}
        <div className="p-4 flex items-center justify-between">
          <Link to="/">
            <h1 className="text-xl font-bold text-primary">A-Series <sup className="text-xs">TM</sup></h1>
          </Link>


          <button
            onClick={onClose}
            className="lg:hidden p-2 -mr-2 text-subtext hover:text-maintext rounded-lg hover:bg-surface"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <NavLink to="/dashboard/chat" className={navItemClass} onClick={onClose}>
            <MessageSquare className="w-5 h-5" />
            <span>{t('chat')}</span>
          </NavLink>

          <NavLink to={AppRoute.MY_AGENTS} className={navItemClass} onClick={onClose}>
            <Bot className="w-5 h-5" />
            <span>{t('myAgents')}</span>
          </NavLink>

          <NavLink to={AppRoute.MARKETPLACE} className={navItemClass} onClick={onClose}>
            <ShoppingBag className="w-5 h-5" />
            <span>{t('marketplace')}</span>
          </NavLink>



          {/* <NavLink to="/vendor/overview" className={navItemClass} onClick={onClose}>
            <LayoutGrid className="w-5 h-5" />
            <span>{t('vendorDashboard')}</span>
          </NavLink> */}

          {/*<NavLink to={AppRoute.INVOICES} className={navItemClass} onClick={onClose}>
            <FileText className="w-5 h-5" />
            <span>{t('billing')}</span>
          </NavLink>*/}



          {/* <NavLink to="/dashboard/automations" className={navItemClass} onClick={onClose}>
            <Zap className="w-5 h-5" />
            <span>Automations</span>
          </NavLink> */}
          <NavLink to={AppRoute.ADMIN} className={navItemClass} onClick={onClose}>
            <Settings className="w-5 h-5" />
            <span>{t('adminDashboard')}</span>
          </NavLink>


        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-border bg-secondary/30 relative space-y-2">
          {/* Moved Updates Link */}
          <NavLink to={AppRoute.NOTIFICATIONS} className={navItemClass} onClick={onClose}>
            <div className="relative">
              <Bell className="w-5 h-5" />
              {(() => {
                const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0;
                return unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 border-2 border-secondary flex items-center justify-center text-[10px] font-bold text-white shadow-sm hover:scale-110 transition-transform">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                );
              })()}
            </div>
            <span>{t('updates') || 'Updates'}</span>
          </NavLink>
          {token ? (
            /* Integrated Profile Card */
            <div
              onClick={() => {
                navigate(AppRoute.PROFILE);
                onClose();
              }}
              className="rounded-xl border border-transparent hover:bg-secondary transition-all cursor-pointer flex items-center gap-2 p-2 group"
            >
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase shrink-0 overflow-hidden border border-primary/10 group-hover:bg-primary/30 transition-colors">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      if (parent) {
                        parent.classList.add("flex", "items-center", "justify-center");
                        parent.innerText = user.name ? user.name.charAt(0).toUpperCase() : "U";
                      }
                    }}
                  />
                ) : (
                  user.name ? user.name.charAt(0).toUpperCase() : "U"
                )}
              </div>

              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-bold text-maintext truncate group-hover:text-primary transition-colors">{user.name}</p>
                <p className="text-[11px] text-subtext truncate">{user.email}</p>
              </div>

              <div className="text-subtext group-hover:text-primary transition-colors">
                <User className="w-4 h-4" />
              </div>
            </div>
          ) : (
            /* Guest / Login State */
            <div
              onClick={() => navigate(AppRoute.LOGIN)}
              className="rounded-xl border border-transparent hover:bg-secondary transition-all cursor-pointer flex items-center gap-3 px-3 py-2 group"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase shrink-0 border border-primary/10 group-hover:bg-primary/20 transition-colors">
                <User className="w-4 h-4" />
              </div>
              <div className="font-bold text-maintext text-xs group-hover:text-primary transition-colors">
                Log In
              </div>
            </div>
          )}

          <div className="mt-1 flex flex-col gap-1">
            {/* Region/Language Indicator - Only show if logged in */}
            {token && (
              <button
                onClick={() => {
                  navigate(AppRoute.PROFILE, { state: { openLanguage: true, timestamp: Date.now() } });
                  onClose();
                }}
                className="group flex items-center justify-center gap-2 px-2 py-1.5 rounded-lg text-subtext hover:bg-secondary hover:text-maintext transition-all text-[10px] font-bold uppercase tracking-wider border border-transparent hover:border-border"
              >
                <img
                  src={getFlagUrl(regionFlags[region] || 'in')}
                  alt={region}
                  className="w-3.5 h-2.5 object-cover rounded-sm shadow-sm"
                />
                <span>{regionFlags[region] || 'IN'} - {language.substring(0, 2).toUpperCase()}</span>
              </button>
            )}

            {/* FAQ Button */}
            <button
              onClick={() => setIsFaqOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-2 py-1.5 rounded-lg text-subtext hover:bg-secondary hover:text-maintext transition-all text-xs border border-transparent hover:border-border"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t('helpFaq')}</span>
            </button>
          </div>
        </div>
      </div >

      {/* FAQ Modal */}
      <HelpFAQModal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
        user={user}
      />
    </>
  );
};

export default Sidebar;
