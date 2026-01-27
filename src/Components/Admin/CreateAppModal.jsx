import React, { useState } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';

const CreateAppModal = ({ isOpen, onClose, onSubmit }) => {
    const initialFormData = {
        agentName: '',
        description: '',
        agentUrl: '',
        category: 'Business OS',
        pricing: 'Free'
    };

    const [formData, setFormData] = useState(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showSubscriptionConfig, setShowSubscriptionConfig] = useState(false);
    const [isPricingSaved, setIsPricingSaved] = useState(false);
    const [activeEditingPlan, setActiveEditingPlan] = useState('Basic');
    const [activeDropdown, setActiveDropdown] = useState(null); // 'category' | 'pricing' | null
    const [subscriptionConfig, setSubscriptionConfig] = useState({
        plans: ['Basic'], // Default selected
        currency: 'USD',
        prices: {
            Basic: { monthly: 0, yearly: 0 },
            Pro: { monthly: 0, yearly: 0 }
        },
        billingCycle: 'monthly'
    });

    if (!isOpen) return null;

    const resetForm = () => {
        setFormData(initialFormData);
        setShowSubscriptionConfig(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Merge subscription config if pricing is Subscription
            const finalData = {
                ...formData,
                pricingConfig: formData.pricing === 'Subscription' ? subscriptionConfig : null
            };
            await onSubmit(finalData);
            resetForm();
            onClose();
        } catch (error) {
            console.error("Failed to create app:", error);
            alert(`Failed to create app: ${error.message || 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlanToggle = (plan) => {
        setSubscriptionConfig(prev => {
            let newPlans = prev.plans.includes(plan)
                ? prev.plans.filter(p => p !== plan)
                : [...prev.plans, plan];

            // Logic to switch active editing plan if current one is removed
            // or if a new paid plan is added and we were on Free/None
            if (plan !== 'Free' && !prev.plans.includes(plan)) {
                // Just added a paid plan, make it active
                setActiveEditingPlan(plan);
            } else if (plan !== 'Free' && prev.plans.includes(plan) && activeEditingPlan === plan) {
                // Removing currently active plan, switch to another paid plan if exists
                const otherPaid = newPlans.find(p => p !== 'Free');
                if (otherPaid) setActiveEditingPlan(otherPaid);
            }

            return { ...prev, plans: newPlans };
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePriceChange = (value) => {
        if (activeEditingPlan === 'Free') return; // Double check safety

        setSubscriptionConfig(prev => ({
            ...prev,
            prices: {
                ...prev.prices,
                [activeEditingPlan]: {
                    ...prev.prices[activeEditingPlan],
                    [prev.billingCycle]: parseFloat(value) || 0
                }
            }
        }));
    };

    // Sub-modal for Subscription Configuration
    if (showSubscriptionConfig) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-card w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                    <div className="p-6 border-b border-border flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-maintext">Configure Subscription</h3>
                            <p className="text-xs text-subtext">Set up your agent's pricing tiers</p>
                        </div>
                        <button onClick={() => setShowSubscriptionConfig(false)}><X className="w-5 h-5 text-subtext" /></button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Plan Selection */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-extrabold text-subtext uppercase tracking-wider">SELECT SUBSCRIPTION PLAN(S)</label>
                            <div className="flex bg-secondary p-1 rounded-xl">
                                {['Free', 'Basic', 'Pro'].map(plan => (
                                    <button
                                        key={plan}
                                        onClick={() => handlePlanToggle(plan)}
                                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${subscriptionConfig.plans.includes(plan) ? 'bg-white dark:bg-card text-primary shadow-sm' : 'text-subtext hover:text-maintext'}`}
                                    >
                                        {plan} {subscriptionConfig.plans.includes(plan) && '✓'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Info Alert */}
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 flex gap-3">
                            <AlertCircle className="w-4 h-4 text-orange-500 shrink-0" />
                            <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">BASIC 10k messages - Basic support. Need more? Get Pro.</p>
                        </div>

                        {/* Currency */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-extrabold text-subtext uppercase tracking-wider">SELECT CURRENCY</label>
                            <select
                                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm font-bold text-maintext outline-none"
                                value={subscriptionConfig.currency}
                                onChange={(e) => setSubscriptionConfig(prev => ({ ...prev, currency: e.target.value }))}
                            >
                                <option value="USD">United States (USD)</option>
                                <option value="INR">India (INR)</option>
                                <option value="EUR">Europe (EUR)</option>
                            </select>
                        </div>

                        {/* Price Input */}
                        {/* Price Input Section - Only for Paid Plans */}
                        {subscriptionConfig.plans.filter(p => p !== 'Free').length > 0 ? (
                            <div className="space-y-4">
                                {/* Plan Tabs */}
                                <div className="flex bg-secondary p-1 rounded-xl">
                                    {subscriptionConfig.plans.filter(p => p !== 'Free').map(plan => (
                                        <button
                                            key={plan}
                                            onClick={() => setActiveEditingPlan(plan)}
                                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeEditingPlan === plan ? 'bg-white dark:bg-card text-primary shadow-sm' : 'text-subtext hover:text-maintext'}`}
                                        >
                                            Configure {plan}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="border-l-4 border-primary pl-3">
                                        <h4 className="font-bold text-maintext">{activeEditingPlan} Plan Pricing</h4>
                                    </div>
                                    <div className="flex bg-secondary rounded-lg p-0.5">
                                        {['monthly', 'yearly'].map(cycle => (
                                            <button
                                                key={cycle}
                                                onClick={() => setSubscriptionConfig(prev => ({ ...prev, billingCycle: cycle }))}
                                                className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${subscriptionConfig.billingCycle === cycle ? 'bg-primary text-white' : 'text-subtext'}`}
                                            >
                                                {cycle}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-subtext">$</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={subscriptionConfig.prices[activeEditingPlan]?.[subscriptionConfig.billingCycle] || ''}
                                        className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-4 text-2xl font-bold text-maintext outline-none focus:border-primary transition-colors"
                                        onChange={(e) => handlePriceChange(e.target.value)}
                                    />
                                </div>

                                {/* Recommended Prices */}
                                <div className="grid grid-cols-3 gap-2">
                                    {[9, 19, 29, 49, 99, 199].map(price => (
                                        <button
                                            key={price}
                                            onClick={() => handlePriceChange(price)}
                                            className="py-2 border border-border rounded-lg text-xs font-bold text-subtext hover:border-primary hover:text-primary transition-colors"
                                        >
                                            {price}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-8 text-center bg-secondary/30 rounded-2xl border border-dashed border-border">
                                <p className="text-sm font-bold text-maintext">Free Plan Selected</p>
                                <p className="text-xs text-subtext mt-1">Users can access this agent for free.</p>
                            </div>
                        )}
                        <div className="flex gap-3 pt-4">
                            <button onClick={() => setShowSubscriptionConfig(false)} className="flex-1 py-3 text-sm font-bold text-subtext hover:bg-secondary rounded-xl transition-colors">Cancel</button>
                            <button
                                onClick={() => {
                                    setIsPricingSaved(true);
                                    setTimeout(() => {
                                        setShowSubscriptionConfig(false);
                                        setIsPricingSaved(false);
                                    }, 800);
                                }}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold shadow-lg transition-all ${isPricingSaved ? 'bg-green-500 text-white shadow-green-500/20 scale-105' : 'bg-primary text-white hover:shadow-primary/20'}`}
                            >
                                {isPricingSaved ? 'Pricing Updated! ✓' : 'Confirm Subscription Pricing'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-xl rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-maintext">Create New Agent</h2>
                            <p className="text-xs text-subtext">Add a new AI agent to your marketplace</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-secondary rounded-full transition-colors text-subtext"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5 overflow-y-auto max-h-[75vh]">
                    {/* ... Existing fields ... */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-maintext uppercase tracking-wider flex items-center gap-1">
                            App Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="agentName"
                            required
                            placeholder="e.g., My Awesome AI App"
                            autoComplete="off"
                            value={formData.agentName}
                            onChange={handleChange}
                            className="w-full bg-secondary border border-border rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-subtext/50 text-maintext"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-maintext uppercase tracking-wider flex items-center gap-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            required
                            rows={3}
                            placeholder="Describe what your AI agent does..."
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-secondary border border-border rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-maintext placeholder:text-subtext/50"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="space-y-1.5 flex-1">
                            <label className="text-[10px] font-extrabold text-maintext uppercase tracking-wider">
                                App Live URL
                            </label>
                            <input
                                type="text"
                                name="agentUrl"
                                placeholder="e.g., yourapp.com or https://yourapp.com"
                                value={formData.agentUrl}
                                onChange={handleChange}
                                className="w-full bg-secondary border border-border rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-subtext/50 text-maintext h-[86px]"
                            />
                        </div>

                        <div className="space-y-1.5 w-24 shrink-0">
                            <label className="text-[10px] font-extrabold text-maintext uppercase tracking-wider text-center block">
                                ICON
                            </label>
                            <label className="w-full h-[86px] bg-secondary border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all relative overflow-hidden group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                                {formData.avatar ? (
                                    <img src={formData.avatar} alt="Icon" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <div className="w-6 h-6 mb-1 text-subtext group-hover:text-primary transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                            </svg>
                                        </div>
                                        <span className="text-[8px] font-bold text-subtext group-hover:text-primary">UPLOAD</span>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold text-maintext uppercase tracking-wider">
                                Category
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
                                    className="w-full bg-secondary border border-border rounded-3xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-maintext text-left flex items-center justify-between"
                                >
                                    <span>{formData.category}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-subtext transition-transform ${activeDropdown === 'category' ? 'rotate-180' : ''}`}>
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </button>

                                {activeDropdown === 'category' && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-3xl shadow-xl z-20 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
                                            {[
                                                'Business OS',
                                                'Data & Intelligence',
                                                'Sales & Marketing',
                                                'HR & Finance',
                                                'Design & Creative',
                                                'Medical & Health AI',
                                                'general'
                                            ].map(opt => (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, category: opt }));
                                                        setActiveDropdown(null);
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-secondary/50 transition-colors ${formData.category === opt ? 'text-primary font-bold bg-primary/5' : 'text-maintext'}`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold text-maintext uppercase tracking-wider">
                                Pricing Model
                            </label>
                            <div className="flex gap-2">
                                <div className="relative w-full">
                                    <button
                                        type="button"
                                        onClick={() => setActiveDropdown(activeDropdown === 'pricing' ? null : 'pricing')}
                                        className="w-full bg-secondary border border-border rounded-3xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-maintext text-left flex items-center justify-between"
                                    >
                                        <span>{formData.pricing}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-subtext transition-transform ${activeDropdown === 'pricing' ? 'rotate-180' : ''}`}>
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </button>

                                    {activeDropdown === 'pricing' && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-3xl shadow-xl z-20 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
                                                {['Free', 'Subscription'].map(opt => (
                                                    <button
                                                        key={opt}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, pricing: opt }));
                                                            setActiveDropdown(null);
                                                        }}
                                                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-secondary/50 transition-colors ${formData.pricing === opt ? 'text-primary font-bold bg-primary/5' : 'text-maintext'}`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                                {formData.pricing === 'Subscription' && (
                                    <button
                                        type="button"
                                        onClick={() => setShowSubscriptionConfig(true)}
                                        className="px-4 py-3 bg-primary/10 text-primary rounded-2xl text-sm font-bold hover:bg-primary/20 transition-colors whitespace-nowrap border border-primary/20"
                                    >
                                        Configure
                                    </button>
                                )}
                            </div>
                            {/* Fallback for other models if needed, but per request focusing on Subscription */}
                        </div>
                    </div>

                    {/* Notice */}
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 flex gap-4">
                        <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-maintext mb-0.5">This app will be created as a Draft.</p>
                            <p className="text-[10px] text-subtext leading-relaxed">
                                Draft apps are NOT visible on the A-Series Marketplace. You can publish the app later from the App Details page.
                            </p>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-border flex items-center justify-between bg-secondary">
                    <button
                        onClick={onClose}
                        className="text-sm font-bold text-subtext hover:text-maintext transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-primary text-white px-8 py-4 rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Agent'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateAppModal;
