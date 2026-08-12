import React from 'react';
import Navbar from '../../Components/Header/Navbar';
import Footer from '../../Components/Footer/Footer';

const Gismap = () => {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
            {/* Header */}
            <Navbar />

            {/* Main Area Ready for Redesign */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center max-w-lg w-full">
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">GIS Property Map</h1>
                    <p className="text-slate-500 text-sm">
                        This section has been cleared and is ready for your new custom redesign.
                    </p>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Gismap;