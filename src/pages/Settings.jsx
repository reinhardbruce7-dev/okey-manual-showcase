import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, Search, MoreVertical, Save, Building2, Bell, Globe, Shield, Palette, Check } from 'lucide-react';

export default function Settings() {
  const { addToast } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const [company, setCompany] = useState({
    name: 'Okey Manual Company Nigeria Limited',
    address: '34 Marina Road, Lagos Island, Lagos, Nigeria',
    email: 'procurement@okeymanual.com.ng',
    phone: '+234 801 234 5678',
    taxId: 'RC 456789',
  });

  const [prefs, setPrefs] = useState({ currency: 'USD', language: 'English', timezone: 'Africa/Lagos' });
  const [notifications, setNotifications] = useState({
    quotationReceived: true, rfqUpdate: true, shipmentUpdate: true,
    poConfirmation: true, aiExtraction: true, weeklyDigest: false,
  });
  const [appearance, setAppearance] = useState({ density: 'comfortable', theme: 'light' });

  const handleSave = () => {
    addToast({ type: 'success', message: 'Settings saved successfully.' });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 0', background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <button onClick={() => navigate(-1)} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <ArrowLeft size={22} />
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <Search size={20} />
            </button>
            <button style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '8px 0 2px' }}>Settings</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>Configure the platform</p>
      </div>

      {/* Tab Filters */}
      <div style={{ display: 'flex', gap: '8px', padding: '14px 20px', overflowX: 'auto', background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                background: activeTab === tab.id ? '#059669' : '#f1f5f9',
                color: activeTab === tab.id ? '#ffffff' : '#64748b',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '20px' }}>

          {activeTab === 'company' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(company).map(([key, value]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</label>
                  <input type="text" value={value} onChange={(e) => setCompany(prev => ({ ...prev, [key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#1e293b', outline: 'none' }} />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'preferences' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(prefs).map(([key, value]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', textTransform: 'capitalize' }}>{key}</label>
                  <input type="text" value={value} onChange={(e) => setPrefs(prev => ({ ...prev, [key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#1e293b', outline: 'none' }} />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#334e68', fontWeight: 500 }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                  <button onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                    style={{
                      width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                      background: value ? '#059669' : '#cbd5e1', position: 'relative', transition: 'all 0.2s',
                    }}>
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%', background: 'white',
                      position: 'absolute', top: '3px', transition: 'all 0.2s',
                      left: value ? '23px' : '3px',
                    }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'appearance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '10px', textTransform: 'capitalize' }}>Layout Density</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['compact', 'comfortable', 'spacious'].map(d => (
                    <button key={d} onClick={() => setAppearance(prev => ({ ...prev, density: d }))}
                      style={{
                        padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                        border: 'none', cursor: 'pointer', textTransform: 'capitalize',
                        background: appearance.density === d ? '#059669' : '#f1f5f9',
                        color: appearance.density === d ? '#ffffff' : '#64748b',
                      }}>{d}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '10px', textTransform: 'capitalize' }}>Theme</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['light', 'dark'].map(t => (
                    <button key={t} onClick={() => setAppearance(prev => ({ ...prev, theme: t }))}
                      style={{
                        padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                        border: 'none', cursor: 'pointer', textTransform: 'capitalize',
                        background: appearance.theme === t ? '#059669' : '#f1f5f9',
                        color: appearance.theme === t ? '#ffffff' : '#64748b',
                      }}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '10px' }}>
                <p style={{ fontSize: '13px', color: '#334e68', lineHeight: '1.5' }}>
                  This is a POC environment. Authentication and role-based access control are planned for production.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#f8fafc', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Two-Factor Authentication</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Available in production</div>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: '#f1f5f9', color: '#64748b' }}>COMING SOON</span>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <button onClick={handleSave} style={{
              width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
              background: '#059669', color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              <Save size={16} /> Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
