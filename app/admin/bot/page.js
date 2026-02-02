// app/admin/bot/page.js
'use client';

// Panel konfiguracji bota AI i triggerów

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

export default function BotAdmin() {
  const [botConfig, setBotConfig] = useState({ apiKey: '', systemPrompt: '' });
  const [triggers, setTriggers] = useState([]);
  const [newTrigger, setNewTrigger] = useState({ trigger: '', response: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  // Wczytaj dane
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const [botRes, triggersRes] = await Promise.all([
        fetch('/api/config?type=bot'),
        fetch('/api/config?type=triggers')
      ]);
      
      const botData = await botRes.json();
      const triggersData = await triggersRes.json();
      
      setBotConfig(botData);
      setTriggers(triggersData.triggers || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  // Zapisz konfigurację bota
  const handleSaveBot = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'bot', data: botConfig })
      });
      
      if (response.ok) {
        alert('Konfiguracja bota zapisana!');
      }
    } catch (error) {
      alert('Błąd zapisu');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Dodaj trigger
  const handleAddTrigger = async (e) => {
    e.preventDefault();
    
    const newId = triggers.length > 0 
      ? Math.max(...triggers.map(t => t.id)) + 1 
      : 1;
    
    const updatedTriggers = [
      ...triggers,
      { id: newId, ...newTrigger }
    ];
    
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'triggers', 
          data: { triggers: updatedTriggers } 
        })
      });
      
      if (response.ok) {
        setTriggers(updatedTriggers);
        setNewTrigger({ trigger: '', response: '' });
        alert('Trigger dodany!');
      }
    } catch (error) {
      alert('Błąd dodawania triggera');
    }
  };
  
  // Usuń trigger
  const handleDeleteTrigger = async (id) => {
    const updatedTriggers = triggers.filter(t => t.id !== id);
    
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'triggers', 
          data: { triggers: updatedTriggers } 
        })
      });
      
      if (response.ok) {
        setTriggers(updatedTriggers);
        alert('Trigger usunięty!');
      }
    } catch (error) {
      alert('Błąd usuwania triggera');
    }
  };
  
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-12">
        
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Konfiguracja bota AI
        </h1>
        
        {/* Konfiguracja AI */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Ustawienia AI</h2>
          
          <form onSubmit={handleSaveBot} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key (Anthropic Claude)
              </label>
              <input
                type="password"
                value={botConfig.apiKey}
                onChange={(e) => setBotConfig({...botConfig, apiKey: e.target.value})}
                placeholder="sk-ant-..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-sm text-gray-500 mt-1">
                Wklej swój klucz API z console.anthropic.com
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt systemowy
              </label>
              <textarea
                value={botConfig.systemPrompt}
                onChange={(e) => setBotConfig({...botConfig, systemPrompt: e.target.value})}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Jesteś pomocnym asystentem firmy..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Określ jak ma się zachowywać bot AI
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {isLoading ? 'Zapisywanie...' : 'Zapisz konfigurację'}
            </button>
          </form>
        </div>
        
        {/* Triggery */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Dodaj nowy trigger</h2>
          
          <form onSubmit={handleAddTrigger} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trigger (słowo/fraza)
              </label>
              <input
                type="text"
                value={newTrigger.trigger}
                onChange={(e) => setNewTrigger({...newTrigger, trigger: e.target.value})}
                placeholder="np. cena, godziny otwarcia"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Odpowiedź
              </label>
              <textarea
                value={newTrigger.response}
                onChange={(e) => setNewTrigger({...newTrigger, response: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Automatyczna odpowiedź, która zostanie wysłana"
                required
              />
            </div>
            
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Dodaj trigger
            </button>
          </form>
        </div>
        
        {/* Lista triggerów */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Aktualne triggery</h2>
          
          {triggers.length === 0 ? (
            <p className="text-gray-600">Brak triggerów</p>
          ) : (
            <div className="space-y-4">
              {triggers.map((trigger) => (
                <div 
                  key={trigger.id} 
                  className="border rounded-lg p-4 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      Trigger: <span className="text-blue-600">{trigger.trigger}</span>
                    </p>
                    <p className="text-gray-600 mt-2">
                      Odpowiedź: {trigger.response}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteTrigger(trigger.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition ml-4"
                  >
                    Usuń
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </ProtectedRoute>
  );
}
