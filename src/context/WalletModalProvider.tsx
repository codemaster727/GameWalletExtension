import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import WalletModal from '../components/WalletModal';

interface WalletModalContextType {
  loading: boolean;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalType: number;
  setModalType: React.Dispatch<React.SetStateAction<number>>;
}

const WalletModalContext = createContext<WalletModalContextType>(
  {} as WalletModalContextType,
);

export const useWalletModal = () => useContext(WalletModalContext);

export const WalletModalProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<number>(0);

  return (
    <WalletModalContext.Provider
      value={{
        loading,
        open,
        setOpen,
        modalType,
        setModalType,
      }}
    >
      {children}
      <WalletModal />
    </WalletModalContext.Provider>
  );
};
