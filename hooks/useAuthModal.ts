import { create } from "zustand";

interface AUthModalStore{
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const useAuthModal = create<AUthModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}));

export default useAuthModal;