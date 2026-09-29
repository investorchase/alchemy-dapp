"use client";

import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";

// Placeholder Bitcoin provider – wire to a real connector (Leather, Unisat, etc.) later.

type BitcoinContextType = {
  connected: boolean;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
};

const BitcoinContext = createContext<BitcoinContextType | null>(null);

export function BitcoinProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const connect = async () => {
    // TODO: integrate real Bitcoin wallet connector here
    setAddress("bc1qexample...");
    setConnected(true);
  };

  const disconnect = async () => {
    setConnected(false);
    setAddress(null);
  };

  return (
    <BitcoinContext.Provider value={{ connected, address, connect, disconnect }}>
      {children}
    </BitcoinContext.Provider>
  );
}

export function useBitcoin() {
  const ctx = useContext(BitcoinContext);
  if (!ctx) throw new Error("useBitcoin must be used within BitcoinProvider");
  return ctx;
}
