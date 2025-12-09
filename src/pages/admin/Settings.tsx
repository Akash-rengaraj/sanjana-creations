import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { Save } from 'lucide-react';

const Settings = () => {
    const [settings, setSettings] = useState({
        storeName: 'Sanjana Creations',
        currency: 'INR',
        email: 'admin@sanjanacreations.com',
        phone: '+91 98765 43210'
    });

    useEffect(() => {
        const savedSettings = localStorage.getItem('adminSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        localStorage.setItem('adminSettings', JSON.stringify(settings));
        alert('Settings saved successfully!');
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-navy">Settings</h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 max-w-2xl">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Store Name</label>
                        <input
                            name="storeName"
                            value={settings.storeName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Currency</label>
                        <input
                            name="currency"
                            value={settings.currency}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Admin Email</label>
                        <input
                            name="email"
                            value={settings.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Support Phone</label>
                        <input
                            name="phone"
                            value={settings.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                    </div>

                    <div className="pt-4">
                        <Button variant="primary" onClick={handleSave} className="flex items-center gap-2">
                            <Save size={18} /> Save Settings
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
