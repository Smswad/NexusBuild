import { useState } from 'react';
import { Send, MessageSquare, ChevronDown, ChevronUp, Clock, HelpCircle, Phone, Mail } from 'lucide-react';
import { useClientData } from '../../Context/ClientDataContext';

const Support = () => {
    const { loading, support, submitTicket } = useClientData();
    const { exec, faqs, tickets } = support;

    if (loading) {
        return (
            <div className="flex flex-col gap-6 max-w-5xl animate-pulse">
                <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-6 flex flex-col gap-4">
                    <div className="skeleton h-6 w-48 rounded bg-slate-200" />
                    <div className="skeleton h-32 w-full rounded bg-slate-100" />
                </div>
                <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-6 flex flex-col gap-4">
                    <div className="skeleton h-6 w-48 rounded bg-slate-200" />
                    <div className="skeleton h-48 w-full rounded bg-slate-100" />
                </div>
            </div>
        );
    }

    const [openFaq, setOpenFaq] = useState(0);
    const [inquiryType, setInquiryType] = useState('General Question');
    const [subject, setSubject] = useState('');

    const handleTicketSubmit = (e) => {
        e.preventDefault();
        if (!subject.trim()) {
            alert('Please enter a subject for your ticket.');
            return;
        }
        submitTicket(inquiryType, subject, '');
        setSubject('');
    };

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const msg = form.elements.msg.value;
        if (!msg.trim()) return;
        submitTicket('Message', 'Direct Message to ' + exec.name, msg);
        form.reset();
    };

    return (
        <div className="flex gap-6 max-w-6xl items-start">
            
            {/* ══ LEFT COLUMN: Contact & Form ════════════════════════════════ */}
            <div className="w-[360px] flex-shrink-0 flex flex-col gap-6">
                
                {/* Account Exec Contact Card (Matches Overview style) */}
                <div className="bg-[#0F3A70] rounded-lg shadow-sm p-6 text-white">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full bg-white border-2 border-[#A0B2C6] overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-[#0F3A70] text-xl">
                            {exec.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-[16px]">{exec.name}</div>
                            <div className="text-[#A0B2C6] text-xs mt-1">{exec.role}</div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 mb-6">
                        <div className="flex items-center gap-3 text-[#A0B2C6] text-sm">
                            <Mail size={16} /> {exec.email}
                        </div>
                        <div className="flex items-center gap-3 text-[#A0B2C6] text-sm">
                            <Phone size={16} /> {exec.phone}
                        </div>
                    </div>

                    <form className="relative" onSubmit={handleMessageSubmit}>
                        <textarea 
                            name="msg"
                            rows="3" 
                            className="w-full bg-white rounded-lg p-3 pr-12 text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none"
                            placeholder={`Message ${exec.name.split(' ')[0]} regarding your account...`}
                        />
                        <button type="submit" className="absolute right-2 bottom-2 w-8 h-8 bg-[#003178] text-white rounded-md flex items-center justify-center hover:bg-[#0A2550] transition-colors shadow-sm">
                            <Send size={14} />
                        </button>
                    </form>
                </div>

                {/* Submit Formal Inquiry Form */}
                <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm">
                    <div className="p-5 border-b border-[#E2E8F0] flex items-center gap-3">
                        <MessageSquare size={18} className="text-[#003178]" />
                        <h3 className="font-bold text-[16px] text-[#003178]">Submit Support Ticket</h3>
                    </div>
                    <form className="p-5 flex flex-col gap-4" onSubmit={handleTicketSubmit}>
                        
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Inquiry Type</label>
                            <select 
                                value={inquiryType}
                                onChange={(e) => setInquiryType(e.target.value)}
                                className="w-full bg-[#F0F4F8] border border-transparent rounded-lg p-3 text-sm text-slate-800 focus:outline-none focus:border-[#003178] focus:bg-white transition-colors"
                            >
                                <option>General Question</option>
                                <option>Change Order Request</option>
                                <option>Billing & Finance</option>
                                <option>Technical Support</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                            <input 
                                type="text" 
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Brief summary of your request"
                                className="w-full bg-[#F0F4F8] border border-transparent rounded-lg p-3 text-sm text-slate-800 focus:outline-none focus:border-[#003178] focus:bg-white transition-colors"
                            />
                        </div>

                        <button type="submit" className="mt-2 w-full flex items-center justify-center gap-2 bg-[#003178] text-white px-5 py-3.5 rounded-lg hover:bg-[#0A2550] transition-colors text-[13px] font-bold uppercase tracking-wider shadow-sm">
                            <Send size={16} /> Open Ticket
                        </button>
                    </form>
                </div>

            </div>

            {/* ══ RIGHT COLUMN: Tickets & FAQs ═══════════════════════════════ */}
            <div className="flex-1 flex flex-col gap-6">
                
                {/* Active Tickets Table */}
                <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between">
                        <h3 className="font-bold text-[18px] text-[#003178]">Recent Tickets</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#F7F9FB] border-b border-[#E2E8F0]">
                                    <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ticket ID</th>
                                    <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Subject & Date</th>
                                    <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E8F0]">
                                {tickets.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50">
                                        <td className="py-4 px-6 font-mono text-sm font-bold text-[#003178]">{t.id}</td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm font-bold text-slate-800">{t.subject}</div>
                                            <div className="text-xs text-slate-500 mt-1">{t.date}</div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                                                t.status === 'Resolved' 
                                                    ? 'bg-slate-100 text-slate-600' 
                                                    : 'bg-[#E1EFFE] text-[#1E429F]'
                                            }`}>
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FAQs */}
                <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden flex-1">
                    <div className="p-6 border-b border-[#E2E8F0] flex items-center gap-3">
                        <HelpCircle size={18} className="text-[#003178]" />
                        <h3 className="font-bold text-[18px] text-[#003178]">Frequently Asked Questions</h3>
                    </div>
                    <div className="divide-y divide-[#E2E8F0]">
                        {faqs.map((faq, i) => {
                            const isOpen = openFaq === i;
                            return (
                                <div key={i} className="transition-colors">
                                    <button 
                                        onClick={() => setOpenFaq(isOpen ? -1 : i)}
                                        className={`w-full p-6 flex items-start justify-between text-left transition-colors ${isOpen ? 'bg-blue-50/30' : 'hover:bg-slate-50'}`}
                                    >
                                        <span className={`font-bold text-[15px] pr-8 ${isOpen ? 'text-[#003178]' : 'text-slate-800'}`}>
                                            {faq.q}
                                        </span>
                                        {isOpen ? (
                                            <ChevronUp size={20} className="text-[#003178] flex-shrink-0" />
                                        ) : (
                                            <ChevronDown size={20} className="text-slate-400 flex-shrink-0" />
                                        )}
                                    </button>
                                    
                                    {isOpen && (
                                        <div className="px-6 pb-6 text-[14px] text-slate-600 leading-relaxed pt-2 bg-blue-50/30">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Support;
