import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeatureCards from './components/FeatureCards';
import ResultsDashboard from './components/ResultsDashboard';
import RecentSearches from './components/RecentSearches';
import DnsLearningSection from './components/DnsLearningSection';
import HowItWorks from './components/HowItWorks';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { lookupDns, lookupReverseDns, checkBackendHealth } from './services/dnsApi';

const STORAGE_KEY_HISTORY = 'dns_lookup_history';
const STORAGE_KEY_THEME = 'dns_lookup_theme';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
  });

  // Mode state: 'forward' | 'reverse'
  const [mode, setMode] = useState('forward');

  // Query states
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  // Search History
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Ref for search input focusing & results scrolling
  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  // Check backend health on initial mount
  useEffect(() => {
    let isMounted = true;
    const verifyHealth = async () => {
      const isOnline = await checkBackendHealth();
      if (isMounted) setIsBackendOnline(isOnline);
    };

    verifyHealth();
    const interval = setInterval(verifyHealth, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Save history to localStorage
  const saveToHistory = (targetVal, targetType, targetMode) => {
    setHistory((prev) => {
      const filtered = prev.filter(
        (item) => !(item.domain?.toLowerCase() === targetVal.toLowerCase() && item.type === targetType && item.mode === targetMode)
      );
      const updated = [
        { domain: targetVal, type: targetType, mode: targetMode, timestamp: Date.now() },
        ...filtered,
      ].slice(0, 10);
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save history', err);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
    setHistory([]);
    showToast('Search history cleared', 'info');
  };

  // Toast system
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle Theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Switch between Forward DNS and Reverse DNS
  const handleModeChange = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setDomain('');
    if (searchInputRef.current) searchInputRef.current.focus();
    showToast(
      newMode === 'reverse'
        ? 'Switched to Reverse DNS. Enter an IP address to resolve its hostname.'
        : 'Switched to Forward DNS. Enter a domain name to lookup DNS records.',
      'info'
    );
  };

  // Main Lookup Handler (Supports both Forward and Reverse)
  const handleLookup = async (targetQuery, targetType, targetMode) => {
    const activeMode = targetMode !== undefined ? targetMode : mode;
    const queryToExecute = (targetQuery !== undefined ? targetQuery : domain).trim();
    const typeToQuery = targetType !== undefined ? targetType : (activeMode === 'reverse' ? 'PTR' : recordType);

    if (!queryToExecute) {
      showToast(
        activeMode === 'reverse'
          ? 'Please enter a valid IPv4 or IPv6 address (e.g. 192.178.211.139).'
          : 'Please enter a valid domain name (e.g. google.com).',
        'error'
      );
      if (searchInputRef.current) searchInputRef.current.focus();
      return;
    }

    // Prevent duplicate triggers while loading
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (activeMode === 'reverse') {
        // Reverse DNS Lookup (IP -> Hostname)
        const data = await lookupReverseDns(queryToExecute);
        setResult(data);
        saveToHistory(data.ip || queryToExecute, 'PTR', 'reverse');

        if (data.status === 'NXDOMAIN' || data.recordCount === 0) {
          showToast(`No PTR record found for IP ${queryToExecute}`, 'info');
        } else {
          showToast(`Resolved ${data.hostnames?.length || 1} hostname(s) in ${data.queryTimeMs}ms`, 'success');
        }
      } else {
        // Forward DNS Lookup (Domain -> Records)
        const data = await lookupDns(queryToExecute, typeToQuery);
        setResult(data);
        saveToHistory(data.domain || queryToExecute, typeToQuery, 'forward');

        if (data.status === 'NXDOMAIN') {
          showToast(`Domain not found: ${queryToExecute} (NXDOMAIN)`, 'error');
        } else if (data.recordCount === 0) {
          showToast(`Query completed: 0 ${typeToQuery} records found.`, 'info');
        } else {
          showToast(`Found ${data.recordCount} ${typeToQuery} record(s) in ${data.queryTimeMs}ms`, 'success');
        }
      }

      // Smooth scroll to results
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      showToast(err.message || 'Lookup failed. Please verify input and try again.', 'error');
      setResult({
        domain: queryToExecute,
        ip: queryToExecute,
        mode: activeMode,
        queryType: typeToQuery,
        status: 'ERROR',
        recordCount: 0,
        records: [],
        hostnames: [],
        queryTimeMs: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Feature Card / Learning Card click
  const handleSelectType = (selectedType) => {
    if (selectedType === 'PTR') {
      setMode('reverse');
      if (domain.trim()) {
        handleLookup(domain, 'PTR', 'reverse');
      } else {
        if (searchInputRef.current) searchInputRef.current.focus();
        showToast('Selected Reverse DNS (PTR). Enter an IP address to lookup.', 'info');
      }
    } else {
      setMode('forward');
      setRecordType(selectedType);
      if (domain.trim()) {
        handleLookup(domain, selectedType, 'forward');
      } else {
        if (searchInputRef.current) searchInputRef.current.focus();
        showToast(`Selected ${selectedType} record. Enter a domain name to lookup.`, 'info');
      }
    }
  };

  // Repeat past search from history
  const handleRepeatQuery = (pastTarget, pastType, pastMode) => {
    const resolvedMode = pastMode || (pastType === 'PTR' ? 'reverse' : 'forward');
    setMode(resolvedMode);
    setDomain(pastTarget);
    if (resolvedMode === 'forward') {
      setRecordType(pastType);
    }
    handleLookup(pastTarget, pastType, resolvedMode);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Alert System */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Navigation Header */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        isBackendOnline={isBackendOnline}
      />

      {/* Main Content Sections */}
      <main style={{ flex: 1 }}>
        {/* Hero Section with Segmented Mode Toggle and Search Bar */}
        <HeroSection
          mode={mode}
          onModeChange={handleModeChange}
          domain={domain}
          setDomain={setDomain}
          recordType={recordType}
          setRecordType={setRecordType}
          onLookup={handleLookup}
          isLoading={isLoading}
          inputRef={searchInputRef}
        />

        {/* Recent Searches Bar */}
        <RecentSearches
          history={history}
          onSelectQuery={handleRepeatQuery}
          onClearHistory={handleClearHistory}
        />

        {/* Results Dashboard Anchor */}
        <div ref={resultsRef}>
          <ResultsDashboard
            result={result}
            isLoading={isLoading}
            onRefresh={() => {
              if (result?.mode === 'reverse') {
                handleLookup(result.ip || domain, 'PTR', 'reverse');
              } else {
                handleLookup(result?.domain || domain, result?.queryType || recordType, 'forward');
              }
            }}
            onShowToast={showToast}
          />
        </div>

        {/* Four Core Feature Cards */}
        <FeatureCards
          onSelectType={handleSelectType}
          activeType={mode === 'reverse' ? 'PTR' : recordType}
        />

        {/* DNS Educational Learning Section */}
        <DnsLearningSection onSelectType={handleSelectType} />

        {/* How It Works Diagram */}
        <HowItWorks />

        {/* About & College Project Info */}
        <AboutSection />
      </main>

      {/* Footer */}
      <Footer onSelectType={handleSelectType} />
    </div>
  );
}
