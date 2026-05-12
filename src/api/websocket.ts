import cockpit from "cockpit";

const BACKEND_ADDRESS = "127.0.0.1";
const BACKEND_PORT = 8080;

type MessageHandler = (data: unknown) => void;
type LifecycleHandler = () => void;

export interface WebSocketAdapter {
    onMessage(handler: MessageHandler): void;
    onOpen(handler: LifecycleHandler): void;
    onClose(handler: LifecycleHandler): void;
    send(data: string): void;
    close(): void;
}

export function createWebSocketChannel(path: string): WebSocketAdapter {
    const channel = cockpit.channel({
        payload: "websocket-stream1",
        address: BACKEND_ADDRESS,
        port: BACKEND_PORT,
        path: path,
        binary: false,
    });

    const messageHandlers: MessageHandler[] = [];
    const openHandlers: LifecycleHandler[] = [];
    const closeHandlers: LifecycleHandler[] = [];

    channel.addEventListener("message", (_event, data) => {
        let parsed: unknown;
        try {
            parsed = JSON.parse(data);
        } catch {
            parsed = data;
        }
        messageHandlers.forEach(h => h(parsed));
    });

    channel.addEventListener("ready", () => {
        openHandlers.forEach(h => h());
    });

    channel.addEventListener("close", () => {
        closeHandlers.forEach(h => h());
    });

    return {
        onMessage(handler: MessageHandler) {
            messageHandlers.push(handler);
        },
        onOpen(handler: LifecycleHandler) {
            openHandlers.push(handler);
        },
        onClose(handler: LifecycleHandler) {
            closeHandlers.push(handler);
        },
        send(data: string) {
            channel.send(data);
        },
        close() {
            channel.close();
        },
    };
}
