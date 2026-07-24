import { createContext, useContext, useEffect, useState } from "react";

import { getSettings } from "../services/settingsService";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {

    const [settings, setSettings] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadSettings = async () => {

            try {

                const data = await getSettings();

                setSettings(data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        loadSettings();

    }, []);

    return (

        <SettingsContext.Provider
            value={{
                settings,
                loading,
                refreshSettings: async () => {

                    const data = await getSettings();

                    setSettings(data);

                }
            }}
        >

            {children}

        </SettingsContext.Provider>

    );

};

export const useSettings = () => useContext(SettingsContext);