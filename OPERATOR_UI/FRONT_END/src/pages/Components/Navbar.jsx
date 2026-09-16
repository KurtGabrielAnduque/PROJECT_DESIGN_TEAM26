import React from 'react'
// import the necessary dependecies for page navigation
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, BrainCircuit, BadgeCheck, History } from 'lucide-react'

import MAYNILADLOGO from '../../assets/mayniladLogo.png'

function Navbar() {
    const navLinks = [
        { name: 'DashBoard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Dosage Recommendation', path: '/DosageRecommendation', icon: <BrainCircuit size={20} /> },
        { name: 'Treatment Verification', path: '/TreatmentVerification', icon: <BadgeCheck size={20} /> },
        { name: 'Treatment History', path: '/History', icon: <History size={20} /> },
    ]

    // tell the user on where the user is
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col h-screen sticky top-0 shrink-0 hidden md:flex shadow-sm z-20">
            {/* Brand Logo Area */}
            <div className="h-20 flex items-center gap-3 px-6 border-b border-zinc-100">
                <img
                    src={MAYNILADLOGO}
                    className="h-11 w-11 "
                    alt="Logo"
                />
                <div className="flex flex-col">
                    <span className="font-extrabold text-lg text-slate-900 leading-tight">Opti<span className="text-blue-500">Dose</span></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Maynilad Admin Portal</span>
                </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                <p className="px-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Main Menu</p>

                {/* SENIOR FIX: Changed from { } to ( ) for implicit return! */}
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm ${isActive(link.path)
                            ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-500/10' // Active State
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'    // Inactive State
                            }`}
                    >
                        {/* Highlight bar on the left for active items */}
                        {isActive(link.path) && <div className="absolute left-4 w-1 h-6 bg-blue-500 rounded-full" />}
                        <span className={isActive(link.path) ? 'text-blue-500' : 'text-slate-400'}>
                            {link.icon}
                        </span>
                        {link.name}
                    </Link>
                ))}
            </div>

        </aside>
    )
}

export default Navbar