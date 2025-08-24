// src/contexts/LanguageContext.js
import React, { createContext, useEffect, useState, useContext } from "react";

const LanguageContext = createContext();

const TRANSLATIONS = {
  en: {
    // NAV
    nav_home: "Home",
    nav_report: "Report",
    nav_scoreboard: "Scoreboard",
    nav_community: "Community",
    nav_violations: "Violations",
    nav_about: "About",
    nav_profile: "Profile",
    nav_signin: "Sign in",
    nav_logout: "Logout",
    nav_theme: "Toggle theme",

    // HOME
    home_greeting: "Keep our city clean — together",
    home_lead: "Report issues, join local cleanups, and earn EcoPoints for every verified report.",
    home_reportNow: "Report Now",
    home_findCommunity: "Find your community",
    home_reports: "Reports",
    home_resolved: "Resolved",
    home_volunteers: "Volunteers",
    home_liveActivity: "Live activity",
    home_noReports: "No reports yet — be the first!",
    home_upcomingEvents: "Upcoming community events",
    home_yourImpact: "Your Impact",
    home_ecoPoints: "EcoPoints",

    // REPORT
    report_title: "Report an Issue",
    report_subtitle: "Capture a photo or record video and submit evidence (demo).",
    report_startCamera: "Start Camera",
    report_capturePhoto: "Capture Photo",
    report_startRecording: "Start Recording",
    report_stopRecording: "Stop Recording",
    report_upload: "Upload",
    report_preview: "Preview",
    report_submit: "Submit Report",
    report_noPhoto: "No photo",
    report_noVideo: "No video recorded",
    report_recordingUnsupported: "Recording not supported in this browser.",
    report_recordingSaved: "Recording captured (preview shown).",
    report_submitSuccess: "Report submitted! +10 EcoPoints (demo)",
    report_geoUnavailable: "Geolocation unavailable or permission denied.",

    // SCOREBOARD
    scoreboard_title: "Community Leaderboard",
    scoreboard_lead: "Top helpers recognized by the community (demo).",
    scoreboard_contributor: "contributor",

    // COMMUNITY
    community_title: "Neighborhood Chat",
    community_lead: "Join your area's discussion to coordinate cleanups and share reports.",
    community_placeholder: "Message your community...",
    community_noMessages: "No messages yet — start the conversation!",
    community_send: "Send",

    // VIOLATIONS
    violations_title: "Reported Violations",
    violations_lead: "Photos are blurred by default to protect privacy; use responsibly.",
    violations_blur: "Blur sensitive media",
    violations_noMedia: "No media in demo. Submit reports on Report page to populate.",
    violations_view: "View",

    // ABOUT
    about_title: "About WasteWise",
    about_lead: "A civic-first project to help citizens report and reduce waste.",
    about_mission: "Our Mission",
    about_how: "How it Works",
    about_team: "Team & Partners",
    about_future: "Future",

    // LOGIN
    login_welcomeBack: "Welcome back",
    login_createAccount: "Create an account",
    login_email: "Email",
    login_password: "Password",
    login_show: "Show",
    login_hide: "Hide",
    login_remember: "Remember me",
    login_signIn: "Sign in",
    login_createBtn: "Create account",
    login_forgot: "Forgot password?",
    login_guest: "Continue as Guest",
    login_or: "or",
    login_google: "Sign in with Google (demo)",
    login_magic: "Email magic link",
    login_demoNote: "This demo stores users in browser localStorage.",

    // PROFILE
    profile_title: "My Profile",
    profile_lead: "Manage your display name, view submitted reports, and track impact.",
    profile_save: "Save",
    profile_signOut: "Sign out",
    profile_reports: "Your Reports",
    profile_noReports: "You haven't submitted any reports yet.",
    profile_download: "Download",
    profile_markResolved: "Mark resolved",
    profile_delete: "Delete",
    profile_confirmDelete: "Are you sure you want to permanently delete this report? This action cannot be undone.",

    // FOOTER
    footer_copy: "© WasteWise",
    footer_about: "About",
    footer_report: "Report",
    footer_leaderboard: "Leaderboard",

    // NOTFOUND
    notfound_title: "404 — Page not found",
    notfound_lead: "We couldn't find the page you were looking for.",
    notfound_goHome: "Go to Home",
  },

  hi: {
    // NAV
    nav_home: "होम",
    nav_report: "रिपोर्ट",
    nav_scoreboard: "लीडरबोर्ड",
    nav_community: "समुदाय",
    nav_violations: "उल्लंघन",
    nav_about: "हमारे बारे में",
    nav_profile: "प्रोफ़ाइल",
    nav_signin: "साइन इन",
    nav_logout: "लॉग आउट",
    nav_theme: "थीम बदलें",

    // HOME
    home_greeting: "हमारे शहर को साफ रखें — साथ मिलकर",
    home_lead: "समस्याओं की रिपोर्ट करें, स्थानीय साफ-सफाई में शामिल हों, और प्रत्येक सत्यापित रिपोर्ट के लिए EcoPoints कमाएं।",
    home_reportNow: "अभी रिपोर्ट करें",
    home_findCommunity: "समुदाय खोजें",
    home_reports: "रिपोर्ट",
    home_resolved: "सुलझाया गया",
    home_volunteers: "स्वयंसेवक",
    home_liveActivity: "लाइव गतिविधि",
    home_noReports: "अभी तक कोई रिपोर्ट नहीं — पहले बनें!",
    home_upcomingEvents: "आगामी सामुदायिक कार्यक्रम",
    home_yourImpact: "आपका प्रभाव",
    home_ecoPoints: "EcoPoints",

    // REPORT
    report_title: "समस्या रिपोर्ट करें",
    report_subtitle: "प्रमाण के रूप में फोटो लें या वीडियो रिकॉर्ड करें (डेमो)।",
    report_startCamera: "कैमरा चालू करें",
    report_capturePhoto: "फोटो लें",
    report_startRecording: "रिकॉर्डिंग शुरू करें",
    report_stopRecording: "रिकॉर्डिंग रोकें",
    report_upload: "अपलोड करें",
    report_preview: "पूर्वावलोकन",
    report_submit: "रिपोर्ट सबमिट करें",
    report_noPhoto: "कोई फोटो नहीं",
    report_noVideo: "कोई वीडियो रिकॉर्ड नहीं हुआ",
    report_recordingUnsupported: "यह ब्राउज़र रिकॉर्डिंग का समर्थन नहीं करता।",
    report_recordingSaved: "रिकॉर्डिंग कैप्चर की गई (पूर्वावलोकन दिखाया गया)।",
    report_submitSuccess: "रिपोर्ट सबमिट हो गई! +10 EcoPoints (डेमो)",
    report_geoUnavailable: "जियोलोकेशन उपलब्ध नहीं है या अनुमति अस्वीकृत है।",

    // SCOREBOARD
    scoreboard_title: "समुदाय लीडरबोर्ड",
    scoreboard_lead: "समुदाय द्वारा मान्यता प्राप्त शीर्ष मददगार (डेमो)।",
    scoreboard_contributor: "योगदानकर्ता",

    // COMMUNITY
    community_title: "पड़ोस चैट",
    community_lead: "अपने क्षेत्र की चर्चा में शामिल हों और साफ़-सफाई का समन्वय करें।",
    community_placeholder: "समुदाय को संदेश भेजें...",
    community_noMessages: "अभी तक संदेश नहीं — बातचीत शुरू करें!",
    community_send: "भेजें",

    // VIOLATIONS
    violations_title: "रिपोर्ट की गई उल्लंघन",
    violations_lead: "गोपनीयता की रक्षा के लिए फ़ोटो डिफ़ॉल्ट रूप से ब्लर किए जाते हैं; जिम्मेदारी से उपयोग करें।",
    violations_blur: "संवेेदनशील मीडिया ब्लर करें",
    violations_noMedia: "डेमो में कोई मीडिया नहीं। रिपोर्ट पृष्ठ पर रिपोर्ट सबमिट करें।",
    violations_view: "देखें",

    // ABOUT
    about_title: "WasteWise के बारे में",
    about_lead: "नागरिक-केंद्रित परियोजना जो नागरिकों को रिपोर्ट करने और कचरा कम करने में मदद करती है।",
    about_mission: "हमारा मिशन",
    about_how: "यह कैसे काम करता है",
    about_team: "टीम और भागीदार",
    about_future: "भविष्य",

    // LOGIN
    login_welcomeBack: "वापसी पर स्वागत है",
    login_createAccount: "खाता बनाएं",
    login_email: "ईमेल",
    login_password: "पासवर्ड",
    login_show: "दिखाएं",
    login_hide: "छिपाएं",
    login_remember: "मुझे याद रखें",
    login_signIn: "साइन इन",
    login_createBtn: "खाता बनाएं",
    login_forgot: "पासवर्ड भूल गए?",
    login_guest: "अतिथि के रूप में जारी रखें",
    login_or: "या",
    login_google: "Google के साथ साइन इन (डेमो)",
    login_magic: "ईमेल मैजिक लिंक",
    login_demoNote: "यह डेमो ब्राउज़र के localStorage में उपयोगकर्ताओं को संग्रहीत करता है।",

    // PROFILE
    profile_title: "मेरी प्रोफ़ाइल",
    profile_lead: "अपना प्रदर्शन नाम प्रबंधित करें, सबमिट किए गए रिपोर्ट देखें और प्रभाव ट्रैक करें।",
    profile_save: "सहेजें",
    profile_signOut: "साइन आउट",
    profile_reports: "आपकी रिपोर्ट",
    profile_noReports: "आपने अभी तक कोई रिपोर्ट सबमिट नहीं की है।",
    profile_download: "डाउनलोड",
    profile_markResolved: "सुलझाया गया के रूप में चिह्नित करें",
    profile_delete: "हटाएँ",
    profile_confirmDelete: "क्या आप निश्चित रूप से इस रिपोर्ट को स्थायी रूप से हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।",

    // FOOTER
    footer_copy: "© WasteWise",
    footer_about: "हमारे बारे में",
    footer_report: "रिपोर्ट",
    footer_leaderboard: "लीडरबोर्ड",

    // NOTFOUND
    notfound_title: "404 — पृष्ठ नहीं मिला",
    notfound_lead: "हम उस पृष्ठ को नहीं ढूंढ पाए जो आप खोज रहे थे।",
    notfound_goHome: "होम पर जाएँ",
  },

  kn: {
    // NAV
    nav_home: "ಹೋಮ್",
    nav_report: "ವರದಿ",
    nav_scoreboard: "ಲೀಡರ್‌ಬೋರ್ಡ್",
    nav_community: "קה",
    nav_violations: "ಉಲ್ಲಂಘನೆಗಳು",
    nav_about: "ಬಗ್ಗೆ",
    nav_profile: "ಪ್ರೊಫೈಲ್",
    nav_signin: "ಸೈನ್ ಇನ್",
    nav_logout: "ಲಾಗ್ ಔಟ್",
    nav_theme: "ಥೀಮ್ ಬದಲಿಸಿ",

    // HOME
    home_greeting: "ನಮ್ಮ ನಗರವನ್ನು ಸ್ವಚ್ಛವಾಗಿರಿಸಿ — ಒಟ್ಟಾಗಿ",
    home_lead: "समಸ್ಯೆಗಳನ್ನು ವರದಿ ಮಾಡಿ, ಸ್ಥಳೀಯ ಸ್ವಚ್ಛತಾ ಕಾರ್ಯಕ್ರಮಗಳಲ್ಲಿ ಸೇರಿ, ಮತ್ತು EcoPoints ಗಳಿಸಿ.",
    home_reportNow: "ರಿಪೋರ್ಟ್ ಮಾಡಲು",
    home_findCommunity: "ನಿಮ್ಮ ಸಮುದಾಯವನ್ನು ಕಂಡುಹಿಡಿಸಿ",
    home_reports: "ವರದಿಗಳು",
    home_resolved: "ನಿರಾಕರಿಸಲಾಗಿದೆ",
    home_volunteers: "ಸ್ವಯಂಸೇವಕರು",
    home_liveActivity: "ಲೈವ್ ಕ್ರಿಯೆಗಳು",
    home_noReports: "ಇನ್ನೂ ವರದಿಗಳು ಇಲ್ಲ — ಮೊದಲವನು ಆಗಿರಿ!",
    home_upcomingEvents: "ನಿಗದಿಯಾದ ಸಮುದಾಯ ಕಾರ್ಯಕ್ರಮಗಳು",
    home_yourImpact: "ನಿಮ್ಮ ಪ್ರಭಾವ",
    home_ecoPoints: "EcoPoints",

    // REPORT
    report_title: "ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ",
    report_subtitle: "ಸಾಕ್ಷ್ಯವಾಗಿ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ ಅಥವಾ ವೀಡಿಯೊ ರೆಕಾರ್ಡ್ ಮಾಡಿ (ಡೆಮೊ).",
    report_startCamera: "ಕ್ಯಾಮೆರಾ ಪ್ರಾರಂಭಿಸಿ",
    report_capturePhoto: "ಫೋಟೋ ಸೆರೆಹಿಡಿ",
    report_startRecording: "ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ",
    report_stopRecording: "ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ",
    report_upload: "ಅಪ್‍ಲೋಡ್ ಮಾಡಿ",
    report_preview: "ಪೂರ್ವಾವಲೋಕನ",
    report_submit: "ವರದಿ ಸಲ್ಲಿಸಿ",
    report_noPhoto: "ಇಲ್ಲ ಫೋಟೋ",
    report_noVideo: "ಇಲ್ಲ ವೀಡಿಯೋ ರೆಕಾರ್ಡ್ ಆಗಿಲ್ಲ",
    report_recordingUnsupported: "ಈ ಬ್ರೌಸರ್ ರೆಕಾರ್ಡಿಂಗ್ ಅನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ.",
    report_recordingSaved: "ರೆಕಾರ್ಡಿಂಗ್ ಸ೦ಗ್ರಹಿಸಲಾಗಿದೆ (ಪೂರ್ವಾವಲೋಕನ ತೋರಿಸಲಾಗಿದೆ).",
    report_submitSuccess: "ವರದಿ ಸಲ್ಲಿಸಲಾಗಿದೆ! +10 EcoPoints (ಡೆಮೊ)",
    report_geoUnavailable: "ಸ್ಥಳೀಯ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ ಅಥವಾ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ.",

    // SCOREBOARD
    scoreboard_title: "ಸಮುದಾಯ ಲೀಡರ್‌ಬೋರ್ಡ್",
    scoreboard_lead: "ಸಮುದಾಯದ ಹಿರಿಯರು (ಡೆಮೊ).",
    scoreboard_contributor: "ದಾನಿ",

    // COMMUNITY
    community_title: "ನೆರೆಹೊರೆಯ ಚಾಟ್",
    community_lead: "ನಿಮ್ಮ ಪ್ರದೇಶದ ಚರ್ಚೆಯಲ್ಲಿ ಸೇರಿ ಸ್ವಚ್ಛತಾ ಕಾರ್ಯಗಳನ್ನು ಸಂಯೋಜಿಸಿ.",
    community_placeholder: "ನಿಮ್ಮ ಸಮುದಾಯಕ್ಕೆ ಸಂದೇಶ ಬರೆಹ...",
    community_noMessages: "ಇನ್ನೂ ಸಂದೇಶಗಳಿಲ್ಲ — ಚರ್ಚೆ ಆರಂಭಿಸಿ!",
    community_send: "ಕಳುಹಿಸು",

    // VIOLATIONS
    violations_title: "ವರದಿ ಮಾಡಿಕೊಂಡ ಉಲ್ಲಂಘನೆಗಳು",
    violations_lead: "ಗೌಪ್ಯತೆಯನ್ನು ಕಾಪಾಡಲು ಚಿತ್ರಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ತೋರಿಸಲಾಗುತ್ತದೆ; ಜವಾಬ್ದಾರಿಯಾಗಿ ಬಳಸಿರಿರಿ.",
    violations_blur: "ಗೋಚರ ತಯಾರಿಗೆ ಮಾಧ್ಯಮವನ್ನು ಬ್ಲರ್ ಮಾಡಿ",
    violations_noMedia: "ಡೆಮೊದಲ್ಲಿ ಯಾವುದೇ ಮಾಧ್ಯಮವಿಲ್ಲ. ವರದಿ ಪುಟದಲ್ಲಿ ವರದಿ ಸಲ್ಲಿಸಿ.",
    violations_view: "ನೋಡಲು",

    // ABOUT
    about_title: "WasteWise ಬಗ್ಗೆ",
    about_lead: "ನಗರವನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಲು ನಾಗরিক-ಪ್ರಥಮ ಯೋಜನೆ.",
    about_mission: "ನಮ್ಮ ಗುರಿ",
    about_how: "ಮೇಲೆ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
    about_team: "ಟೀಮ್ ಮತ್ತು ಪಾಲುದಾರರು",
    about_future: "ಭವಿಷ್ಯ",

    // LOGIN
    login_welcomeBack: "ಮீಳಿ ಬರಿದ್ದಕ್ಕೆ ಸುಸ್ವಾಗತ",
    login_createAccount: "ಖಾತೆಯನ್ನು ರಚಿಸಿ",
    login_email: "ಇಮೇಲ್",
    login_password: "ಗೋಪ್ಯವಾದ ಪದ",
    login_show: "ತೋರಿಸು",
    login_hide: "ಮರೆಮಾಡು",
    login_remember: "ನನ್ನನ್ನು ನೆನಪು ಮಾಡಿ",
    login_signIn: "ಸೈನ್ ಇನ್",
    login_createBtn: "ಖಾತೆ ರಚಿಸಿ",
    login_forgot: "ಗುಟ್ಟು ಪದ ಮರೆತುಹೋಗಿದೆಯೇ?",
    login_guest: "ಅತಿಥಿಯಾಗಿ ಮುಂದುವರೆಯಿರಿ",
    login_or: "ಅಥವಾ",
    login_google: "Google ನೊಂದಿಗೆ ಸೈನ್ ಇನ್ (ಡೆಮೊ)",
    login_magic: "ಇಮೇಲ್ ಮಾಯಾಜಾಲ ಲಿಂಕ್",
    login_demoNote: "ಡೆಮೊ ಈ ಬ್ರೌಸರ್ localStorage ನಲ್ಲಿ ಬಳಕೆದಾರರನ್ನು ಸಂರಕ್ಷಿಸುತ್ತದೆ.",

    // PROFILE
    profile_title: "ನನ್ನ ಪ್ರೊಫೈಲ್",
    profile_lead: "ನಿಮ್ಮ ಪ್ರದರ್ಶನ ಹೆಸರನ್ನು ನಿರ್ವಹಿಸಿ, ಸಲ್ಲಿಸಿದ ವರದಿಗಳನ್ನು ನೋಡಿ ಮತ್ತು ಪರಿಣಾಮವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
    profile_save: "ಉಳಿಸಿ",
    profile_signOut: "ಸೈನ್ ಔಟ್",
    profile_reports: "ನಿಮ್ಮ ವರದಿಗಳು",
    profile_noReports: "ನೀವು ಇನ್ನೂ ಯಾವುದೇ ವರದಿಗಳನ್ನು ಸಲ್ಲಿಸಿಲ್ಲ.",
    profile_download: "ಡೌನ್ಲೋಡ್",
    profile_markResolved: "ನಿರಾಕರಿಸಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ",
    profile_delete: "ಅಳಿಸಿ",
    profile_confirmDelete: "ಈ ವರದಿಯನ್ನು ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಲು ನೀವು ಖಾತ್ರಿಯಾಗಿದ್ದೀರಾ? ಈ ಚಟುವಟಿಕೆಯನ್ನು ಹಿಂದಕ್ಕೆ ಮಾಡಲಾಗುವುದಿಲ್ಲ.",

    // FOOTER
    footer_copy: "© WasteWise",
    footer_about: "ಬಗ್ಗೆ",
    footer_report: "ವರದಿ",
    footer_leaderboard: "ಲೀಡರ್‌ಬೋರ್ಡ್",

    // NOTFOUND
    notfound_title: "404 — ಪುಟ ದೊರಕಲಿಲ್ಲ",
    notfound_lead: "ನಾವು ನೀವು ಹುಡುಕುತ್ತಿದ್ದ ಪುಟವನ್ನು ಕಂಡುಹಿಡಿಯಲಿಲ್ಲ.",
    notfound_goHome: "ಮನೆಗೆ ಹೋಗಿ",
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("wm_lang") || "en");

  useEffect(() => {
    localStorage.setItem("wm_lang", lang);
  }, [lang]);

  function t(key) {
    return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS["en"][key] || key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, TRANSLATIONS }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

export default LanguageContext;
