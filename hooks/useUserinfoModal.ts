import { create } from "zustand";

interface useUserinfoModalStore{
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const useUserinfoModal = create<useUserinfoModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}));

export default useUserinfoModal;