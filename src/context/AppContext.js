import { useContext, createContext, useMemo, useState } from "react";

const AppContext = createContext({})

export const AppProvider = ({ children }) => {

    const [showLoginDialog, setShowLoginDialog] = useState(false)
    const [showPaymentDialog, setShowPaymentDialog] = useState(false)

    const contextValue = useMemo(() => ({
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

export const useApp = () => useContext(AppContext)