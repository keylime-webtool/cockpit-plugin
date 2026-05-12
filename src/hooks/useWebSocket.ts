import { useEffect, useRef, useState, useCallback } from "react";
import { createWebSocketChannel, type WebSocketAdapter } from "../api/websocket";

const INITIAL_RECONNECT_DELAY_MS = 1000;
const MAX_RECONNECT_DELAY_MS = 30000;
const BACKOFF_MULTIPLIER = 2;

interface UseWebSocketOptions {
    path: string;
    onMessage: (data: unknown) => void;
    enabled?: boolean;
}

export function useWebSocket({ path, onMessage, enabled = true }: UseWebSocketOptions) {
    const channelRef = useRef<WebSocketAdapter | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const retryCountRef = useRef(0);
    const onMessageRef = useRef(onMessage);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    const connect = useCallback(() => {
        const channel = createWebSocketChannel(path);
        channelRef.current = channel;

        channel.onOpen(() => {
            setConnected(true);
            retryCountRef.current = 0;
        });

        channel.onMessage((data) => {
            onMessageRef.current(data);
        });

        channel.onClose(() => {
            setConnected(false);
            const delay = Math.min(
                INITIAL_RECONNECT_DELAY_MS * BACKOFF_MULTIPLIER ** retryCountRef.current,
                MAX_RECONNECT_DELAY_MS,
            );
            retryCountRef.current += 1;
            reconnectTimeoutRef.current = setTimeout(connect, delay);
        });
    }, [path]);

    useEffect(() => {
        if (!enabled) return;

        connect();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            channelRef.current?.close();
        };
    }, [connect, enabled]);

    return { connected };
}
