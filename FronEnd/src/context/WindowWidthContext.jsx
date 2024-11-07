import { createContext, useEffect, useState } from "react";

const MOBILE_SIZE_LIMIT = 640;

export const WindowWidthContext = createContext();

export const WindowWidthProvider = ({ children }) => {

    const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_SIZE_LIMIT)

    useEffect(() => {

        const handleSizeChange = () => {
            setIsMobile(window.innerWidth < MOBILE_SIZE_LIMIT)
        }

        window.addEventListener('resize', handleSizeChange)


        return () => { removeEventListener('resize', handleSizeChange) }
    }, [])


    return (
        <WindowWidthContext.Provider value={{ isMobile }}>
            {children}
        </WindowWidthContext.Provider>
        )
}
