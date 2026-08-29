import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type LanguageCode = "en" | "mr" | "hi";

const LANGUAGE_KEY = "infrasetu.language";

const translations = {
  en: {
    language: "Language",
unread: "unread",
openNavigation: "Open navigation",
toggleSidebar: "Toggle sidebar",
profile: "Profile",
accountSettings: "Account Settings",
    dashboard: "Dashboard",
    infrastructure: "Infrastructure",
    gisMap: "GIS & Map",
    satellite: "Satellite Intelligence",
    riskAlerts: "Risk & Alerts",
    complaints: "Complaints",
    workOrders: "Work Orders",
    contractors: "Contractors",
    analytics: "Analytics",
    auditTrail: "Audit Trail",
    settings: "Settings",
    help: "Help",
    command: "Command",
    mockDataMode: "Mock data mode",

    notifications: "Notifications",
    search: "Search assets, work orders…",
    switchCitizen: "Switch to citizen view",
    switchContractor: "Switch to contractor view",
    signOut: "Sign out",

    governmentAdministrator: "Government Administrator",
    publicWorksDepartment: "Public Works Department",

    settingsTitle: "Settings",
    settingsSubtitle:
      "Manage your government account, preferences and application appearance.",
    userInformation: "User Information",
    userInformationDescription:
      "Details associated with your government administrator account.",
    userId: "User ID",
    organisation: "Organisation",
    role: "Role",
    accountStatus: "Account Status",
    active: "Active",

    appearance: "Appearance",
    appearanceDescription:
      "Adjust how the government administration portal is displayed.",
    darkMode: "Dark Mode",
    darkModeDescription:
      "Use a darker interface for low-light environments.",
    enabled: "Enabled",
    enable: "Enable",

    security: "Security",
    securityDescription:
      "Security information for your administrative account.",
    governmentAccess: "Government Administrator Access",
    securityMessage:
      "Your account has administrative access to infrastructure, complaints, work orders, analytics and audit records.",

    helpTitle: "Help & Support",
    helpSubtitle:
      "Guidance and support for government administrators using InfraSetu.",
    gettingStarted: "Getting Started",
    gettingStartedDescription:
      "Quick guidance for using the administration portal.",
    support: "Support",
    supportDescription:
      "Contact the appropriate support channel when assistance is required.",
  },

  mr: {
language: "भाषा",
unread: "न वाचलेल्या",
openNavigation: "नेव्हिगेशन उघडा",
toggleSidebar: "साइडबार बदला",
profile: "प्रोफाइल",
accountSettings: "खाते सेटिंग्ज",
    dashboard: "डॅशबोर्ड",
    infrastructure: "पायाभूत सुविधा",
    gisMap: "GIS आणि नकाशा",
    satellite: "उपग्रह बुद्धिमत्ता",
    riskAlerts: "जोखीम आणि सूचना",
    complaints: "तक्रारी",
    workOrders: "कामाचे आदेश",
    contractors: "कंत्राटदार",
    analytics: "विश्लेषण",
    auditTrail: "ऑडिट ट्रेल",
    settings: "सेटिंग्ज",
    help: "मदत",
    command: "कमांड",
    mockDataMode: "मॉक डेटा मोड",

    notifications: "सूचना",
    search: "मालमत्ता, कामाचे आदेश शोधा…",
    switchCitizen: "नागरिक दृश्यावर जा",
    switchContractor: "कंत्राटदार दृश्यावर जा",
    signOut: "साइन आउट",

    governmentAdministrator: "शासकीय प्रशासक",
    publicWorksDepartment: "सार्वजनिक बांधकाम विभाग",

    settingsTitle: "सेटिंग्ज",
    settingsSubtitle:
      "तुमचे शासकीय खाते, प्राधान्ये आणि अनुप्रयोगाचे स्वरूप व्यवस्थापित करा.",
    userInformation: "वापरकर्ता माहिती",
    userInformationDescription:
      "तुमच्या शासकीय प्रशासक खात्याशी संबंधित माहिती.",
    userId: "वापरकर्ता आयडी",
    organisation: "संस्था",
    role: "भूमिका",
    accountStatus: "खात्याची स्थिती",
    active: "सक्रिय",

    appearance: "स्वरूप",
    appearanceDescription:
      "शासकीय प्रशासन पोर्टल कसे दिसावे ते समायोजित करा.",
    darkMode: "डार्क मोड",
    darkModeDescription:
      "कमी प्रकाशाच्या वातावरणासाठी गडद इंटरफेस वापरा.",
    enabled: "सक्षम",
    enable: "सक्षम करा",

    security: "सुरक्षा",
    securityDescription:
      "तुमच्या प्रशासकीय खात्याची सुरक्षा माहिती.",
    governmentAccess: "शासकीय प्रशासक प्रवेश",
    securityMessage:
      "तुमच्या खात्याला पायाभूत सुविधा, तक्रारी, कामाचे आदेश, विश्लेषण आणि ऑडिट नोंदींवर प्रशासकीय प्रवेश आहे.",

    helpTitle: "मदत आणि समर्थन",
    helpSubtitle:
      "InfraSetu वापरणाऱ्या शासकीय प्रशासकांसाठी मार्गदर्शन आणि समर्थन.",
    gettingStarted: "सुरुवात",
    gettingStartedDescription:
      "प्रशासन पोर्टल वापरण्यासाठी जलद मार्गदर्शन.",
    support: "समर्थन",
    supportDescription:
      "मदतीची आवश्यकता असल्यास योग्य समर्थन विभागाशी संपर्क साधा.",
  },

  hi: {
language: "भाषा",
unread: "अपठित",
openNavigation: "नेविगेशन खोलें",
toggleSidebar: "साइडबार बदलें",
profile: "प्रोफ़ाइल",
accountSettings: "खाता सेटिंग्स",
    dashboard: "डैशबोर्ड",
    infrastructure: "बुनियादी ढांचा",
    gisMap: "GIS और मानचित्र",
    satellite: "उपग्रह इंटेलिजेंस",
    riskAlerts: "जोखिम और अलर्ट",
    complaints: "शिकायतें",
    workOrders: "कार्य आदेश",
    contractors: "ठेकेदार",
    analytics: "विश्लेषण",
    auditTrail: "ऑडिट ट्रेल",
    settings: "सेटिंग्स",
    help: "सहायता",
    command: "कमांड",
    mockDataMode: "मॉक डेटा मोड",

    notifications: "सूचनाएँ",
    search: "एसेट, कार्य आदेश खोजें…",
    switchCitizen: "नागरिक दृश्य पर जाएँ",
    switchContractor: "ठेकेदार दृश्य पर जाएँ",
    signOut: "साइन आउट",

    governmentAdministrator: "सरकारी प्रशासक",
    publicWorksDepartment: "लोक निर्माण विभाग",

    settingsTitle: "सेटिंग्स",
    settingsSubtitle:
      "अपने सरकारी खाते, प्राथमिकताओं और एप्लिकेशन के स्वरूप को प्रबंधित करें।",
    userInformation: "उपयोगकर्ता जानकारी",
    userInformationDescription:
      "आपके सरकारी प्रशासक खाते से संबंधित जानकारी।",
    userId: "उपयोगकर्ता आईडी",
    organisation: "संस्था",
    role: "भूमिका",
    accountStatus: "खाते की स्थिति",
    active: "सक्रिय",

    appearance: "स्वरूप",
    appearanceDescription:
      "सरकारी प्रशासन पोर्टल के प्रदर्शन को समायोजित करें।",
    darkMode: "डार्क मोड",
    darkModeDescription:
      "कम रोशनी वाले वातावरण के लिए गहरे इंटरफेस का उपयोग करें।",
    enabled: "सक्षम",
    enable: "सक्षम करें",

    security: "सुरक्षा",
    securityDescription:
      "आपके प्रशासनिक खाते की सुरक्षा जानकारी।",
    governmentAccess: "सरकारी प्रशासक पहुँच",
    securityMessage:
      "आपके खाते को बुनियादी ढांचे, शिकायतों, कार्य आदेशों, विश्लेषण और ऑडिट रिकॉर्ड तक प्रशासनिक पहुँच प्राप्त है।",

    helpTitle: "सहायता और समर्थन",
    helpSubtitle:
      "InfraSetu का उपयोग करने वाले सरकारी प्रशासकों के लिए मार्गदर्शन और समर्थन।",
    gettingStarted: "शुरुआत",
    gettingStartedDescription:
      "प्रशासन पोर्टल का उपयोग करने के लिए त्वरित मार्गदर्शन।",
    support: "समर्थन",
    supportDescription:
      "सहायता की आवश्यकता होने पर संबंधित सहायता विभाग से संपर्क करें।",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext =
  createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    const saved = window.localStorage.getItem(LANGUAGE_KEY);

    if (saved === "en" || saved === "mr" || saved === "hi") {
      return saved;
    }

    return "en";
  });

  const setLanguage = (next: LanguageCode) => {
    setLanguageState(next);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_KEY, next);
      document.documentElement.lang = next;
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key) => translations[language][key],
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider",
    );
  }

  return context;
}
