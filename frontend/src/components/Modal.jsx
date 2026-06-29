import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {

    if(!isOpen) return null;

    return(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-medium text-nextext">{title}</h2>
                    <button onClick={onClose}>
                        <X size={18} className="text-gray-400" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;