import { motion } from "framer-motion";
import { AlertCircle, Home } from "lucide-react";

const NotFoundPage = ({ onGoHome }: { onGoHome: () => void }) => {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6 max-w-md"
            >
                <AlertCircle className="w-24 h-24 text-yellow-400 mx-auto" />
                <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
                <p className="text-gray-400">
                    The page you are looking for does not exist or has been moved.
                </p>
                <div className="flex justify-center">
                    <button
                        onClick={onGoHome}
                        className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;
