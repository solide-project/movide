"use client"

import * as React from "react"
import { EditorProvider } from "@/components/core/providers/editor-provider"
import { FileSystemProvider } from "@/components/core/providers/file-provider"
import { LoggerProvider } from "@/components/core/providers/logger-provider"
import { NavProvider } from "@/components/core/providers/navbar-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl, type SuiClientOptions } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export interface SolideProvidersProps {
    nonce?: string;
    children?: React.ReactNode;
}

const { networkConfig } = createNetworkConfig({
    testnet: { url: getFullnodeUrl('testnet') },
    devnet: { url: getFullnodeUrl('devnet') },
    mainnet: { url: getFullnodeUrl('mainnet') },
    m2: { url: 'https://devnet.baku.movementlabs.xyz', language: 'sui' },
    baku: { url: "https://devnet.baku.movementlabs.xyz", language: 'sui' }
});
const queryClient = new QueryClient();

export function SolideProviders({ children, ...props }: SolideProvidersProps) {
    return <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} defaultNetwork="baku">
                <WalletProvider>
                    <LoggerProvider>
                        <FileSystemProvider>
                            <EditorProvider>
                                <TooltipProvider delayDuration={0}>
                                    <NavProvider>{children}</NavProvider>
                                </TooltipProvider>
                            </EditorProvider>
                        </FileSystemProvider>
                    </LoggerProvider>
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    </ThemeProvider>
}