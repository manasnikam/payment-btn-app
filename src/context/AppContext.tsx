import { useContext, createContext, useMemo, useState, ReactNode } from "react";

interface AppContextObject {
    showLoginDialog: boolean;
    showPaymentDialog: boolean;
    setShowLoginDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setShowPaymentDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Props {
    children: ReactNode
}

const AppContext = createContext<AppContextObject | null>(null)

export const AppProvider: React.FC<Props> = ({ children }: Props) => {

    const [showLoginDialog, setShowLoginDialog] = useState<boolean>(false)
    const [showPaymentDialog, setShowPaymentDialog] = useState<boolean>(false)

    const contextValue: AppContextObject = useMemo(() => ({
        showLoginDialog,
        showPaymentDialog,
        setShowLoginDialog,
        setShowPaymentDialog
    }), [
        showLoginDialog,
        showPaymentDialog,
        setShowLoginDialog,
        setShowPaymentDialog
    ])

    return (
        <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
    )
}

export const useApp = () => {
    const object: AppContextObject | null = useContext(AppContext);
    if (!object) throw new Error("useApp must be used within the Provider");
    return object;
}