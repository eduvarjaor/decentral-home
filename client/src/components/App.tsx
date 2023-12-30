'use client';
import React, { useState } from 'react';
import Header from './Header';
import Properties from './Properties';

function App() {
    const [isWalletConnected, setIsWalletConnected] = useState(false);

    return (
        <>
            <Header
                isWalletConnected={isWalletConnected}
                setIsWalletConnected={setIsWalletConnected}
            />
            <Properties isWalletConnected={isWalletConnected} />
        </>
    );
}

export default App;
