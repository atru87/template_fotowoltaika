// app/admin/diagnostyka/page.js
'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const runDiagnostics = async (action = null) => {
    setIsLoading(true);
    try {
      const url = action 
        ? `/api/admin/diagnostics?action=${action}`
        : '/api/admin/diagnostics';
      
      const response = await fetch(url);
      const data = await response.json();
      setDiagnostics(data);
    } catch (error) {
      alert('Błąd diagnostyki: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMigrate = async () => {
    if (!confirm('Czy na pewno chcesz zmigrować wszystkie dane z plików do Redis? To nadpisze istniejące dane w Redis.')) {
      return;
    }
    await runDiagnostics('migrate');
  };
  
  const handleReset = async () => {
    if (!confirm('⚠️ UWAGA! To usunie WSZYSTKIE dane z Redis. Czy na pewno chcesz kontynuować?')) {
      return;
    }
    if (!confirm('To jest nieodwracalne! Ostatnia szansa aby anulować.')) {
      return;
    }
    await runDiagnostics('reset');
  };
  
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-12">
        
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Diagnostyka systemu
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Narzędzia</h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => runDiagnostics()}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {isLoading ? 'Sprawdzam...' : '🔍 Sprawdź status systemu'}
            </button>
            
            <button
              onClick={handleMigrate}
              disabled={isLoading || !diagnostics?.kvConfigured}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
            >
              📤 Migruj dane do Redis
            </button>
            
            <button
              onClick={handleReset}
              disabled={isLoading || !diagnostics?.kvConfigured}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400"
            >
              🗑️ Wyczyść Redis
            </button>
          </div>
          
          {diagnostics && !diagnostics.kvConfigured && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800">
                ⚠️ Redis (Vercel KV) nie jest skonfigurowany. Sprawdź zmienne środowiskowe.
              </p>
            </div>
          )}
        </div>
        
        {diagnostics && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Wyniki diagnostyki</h2>
            
            {/* Podstawowe info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Środowisko</h3>
              <div className="bg-gray-50 p-4 rounded font-mono text-sm">
                <div>Czas: {diagnostics.timestamp}</div>
                <div>Środowisko: {diagnostics.environment}</div>
                <div>KV skonfigurowane: {diagnostics.kvConfigured ? '✅ TAK' : '❌ NIE'}</div>
                {diagnostics.kvConnection && (
                  <div>Status połączenia: {diagnostics.kvConnection}</div>
                )}
              </div>
            </div>
            
            {/* Dane w Redis */}
            {diagnostics.kvData && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Dane w Redis ({diagnostics.kvKeysCount || 0} kluczy)
                </h3>
                <div className="bg-gray-50 p-4 rounded font-mono text-sm space-y-1">
                  {Object.entries(diagnostics.kvData).map(([key, status]) => (
                    <div key={key}>
                      <span className="font-semibold">{key}:</span> {status}
                    </div>
                  ))}
                </div>
                
                {diagnostics.kvKeys && diagnostics.kvKeys.length > 0 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                      Pokaż wszystkie klucze w Redis
                    </summary>
                    <div className="bg-gray-50 p-4 rounded font-mono text-xs mt-2">
                      {diagnostics.kvKeys.join(', ')}
                    </div>
                  </details>
                )}
              </div>
            )}
            
            {/* Pliki lokalne */}
            {diagnostics.dataFiles && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Pliki lokalne (/data)</h3>
                <div className="bg-gray-50 p-4 rounded text-sm space-y-2">
                  {Object.entries(diagnostics.dataFiles).map(([filename, info]) => (
                    <div key={filename} className="border-b border-gray-200 pb-2">
                      <div className="font-semibold text-gray-900">{filename}</div>
                      {info.exists ? (
                        <div className="text-gray-600 text-xs">
                          ✅ Istnieje | Rozmiar: {info.size} B | 
                          {info.itemCount !== 'N/A' && ` Elementy: ${info.itemCount} |`}
                          Modyfikacja: {new Date(info.modified).toLocaleString('pl-PL')}
                        </div>
                      ) : (
                        <div className="text-red-600 text-xs">
                          {info.error ? `❌ Błąd: ${info.error}` : '❌ Nie istnieje'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Wyniki migracji */}
            {diagnostics.migration && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Wyniki migracji</h3>
                <div className="bg-green-50 p-4 rounded font-mono text-sm space-y-1">
                  {Object.entries(diagnostics.migration).map(([key, status]) => (
                    <div key={key}>
                      <span className="font-semibold">{key}:</span> {status}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Wyniki reset */}
            {diagnostics.reset && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Wyniki czyszczenia Redis</h3>
                <div className="bg-red-50 p-4 rounded font-mono text-sm">
                  {diagnostics.reset.error ? (
                    <div>❌ Błąd: {diagnostics.reset.error}</div>
                  ) : (
                    <>
                      <div>✅ Usunięto {diagnostics.reset.count} kluczy</div>
                      {diagnostics.reset.deleted && diagnostics.reset.deleted.length > 0 && (
                        <div className="text-xs mt-2">
                          Usunięte klucze: {diagnostics.reset.deleted.join(', ')}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* Raw JSON */}
            <details className="mt-6">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900 font-semibold">
                📋 Pokaż surowe dane JSON
              </summary>
              <pre className="bg-gray-900 text-green-400 p-4 rounded mt-2 text-xs overflow-auto max-h-96">
                {JSON.stringify(diagnostics, null, 2)}
              </pre>
            </details>
          </div>
        )}
        
        {!diagnostics && (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-600">
              Kliknij "Sprawdź status systemu" aby uruchomić diagnostykę
            </p>
          </div>
        )}
        
      </div>
    </ProtectedRoute>
  );
}
