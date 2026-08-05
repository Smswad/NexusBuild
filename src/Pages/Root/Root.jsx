import Navbar from '../../Components/Header/Navbar';
import { Outlet, useNavigation } from 'react-router';
import Footer from '../../Components/Footer/Footer';

const Root = () => {
    const navigation = useNavigation();
    const isNavigating = navigation.state === 'loading';

    return (
        <div className="relative">
            {isNavigating && (
                <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#fe762a]">
                    <div className="h-full bg-[#a14000] animate-pulse w-full flex items-center justify-center">
                        <span className="loading loading-spinner loading-xs text-white"></span>
                    </div>
                </div>
            )}
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default Root;