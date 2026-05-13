import { describe, it, expect, vi, beforeEach } from "vitest";
import cockpit from "cockpit";
import { createWebSocketChannel } from "../websocket";

beforeEach(() => {
    cockpit.__resetMock();
});

describe("createWebSocketChannel", () => {
    it("creates a cockpit channel with websocket-stream1 payload", () => {
        const spy = vi.spyOn(cockpit, "channel");
        createWebSocketChannel("/ws/events");

        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
                payload: "websocket-stream1",
                path: "/ws/events",
                binary: false,
            }),
        );
        spy.mockRestore();
    });

    it("calls onMessage handlers with parsed JSON", () => {
        const channel = cockpit.channel();
        vi.spyOn(cockpit, "channel").mockReturnValue(channel);

        const ws = createWebSocketChannel("/ws/events");
        const handler = vi.fn();
        ws.onMessage(handler);

        (channel as ReturnType<typeof cockpit.channel>).__emit(
            "message",
            undefined,
            '{"type":"update","agent":"a1"}',
        );

        expect(handler).toHaveBeenCalledWith({ type: "update", agent: "a1" });
        vi.restoreAllMocks();
    });

    it("calls onMessage handlers with raw data when JSON parsing fails", () => {
        const channel = cockpit.channel();
        vi.spyOn(cockpit, "channel").mockReturnValue(channel);

        const ws = createWebSocketChannel("/ws/events");
        const handler = vi.fn();
        ws.onMessage(handler);

        (channel as ReturnType<typeof cockpit.channel>).__emit(
            "message",
            undefined,
            "not json",
        );

        expect(handler).toHaveBeenCalledWith("not json");
        vi.restoreAllMocks();
    });

    it("calls onOpen handlers on ready event", () => {
        const channel = cockpit.channel();
        vi.spyOn(cockpit, "channel").mockReturnValue(channel);

        const ws = createWebSocketChannel("/ws/events");
        const handler = vi.fn();
        ws.onOpen(handler);

        (channel as ReturnType<typeof cockpit.channel>).__emit("ready");

        expect(handler).toHaveBeenCalledOnce();
        vi.restoreAllMocks();
    });

    it("calls onClose handlers on close event", () => {
        const channel = cockpit.channel();
        vi.spyOn(cockpit, "channel").mockReturnValue(channel);

        const ws = createWebSocketChannel("/ws/events");
        const handler = vi.fn();
        ws.onClose(handler);

        (channel as ReturnType<typeof cockpit.channel>).__emit("close");

        expect(handler).toHaveBeenCalledOnce();
        vi.restoreAllMocks();
    });

    it("supports multiple handlers per event", () => {
        const channel = cockpit.channel();
        vi.spyOn(cockpit, "channel").mockReturnValue(channel);

        const ws = createWebSocketChannel("/ws/events");
        const h1 = vi.fn();
        const h2 = vi.fn();
        ws.onMessage(h1);
        ws.onMessage(h2);

        (channel as ReturnType<typeof cockpit.channel>).__emit("message", undefined, '"ping"');

        expect(h1).toHaveBeenCalledWith("ping");
        expect(h2).toHaveBeenCalledWith("ping");
        vi.restoreAllMocks();
    });

    it("send delegates to channel.send", () => {
        const channel = cockpit.channel();
        vi.spyOn(cockpit, "channel").mockReturnValue(channel);
        const sendSpy = vi.spyOn(channel, "send");

        const ws = createWebSocketChannel("/ws/events");
        ws.send('{"action":"ping"}');

        expect(sendSpy).toHaveBeenCalledWith('{"action":"ping"}');
        vi.restoreAllMocks();
    });

    it("close delegates to channel.close", () => {
        const channel = cockpit.channel();
        vi.spyOn(cockpit, "channel").mockReturnValue(channel);
        const closeSpy = vi.spyOn(channel, "close");

        const ws = createWebSocketChannel("/ws/events");
        ws.close();

        expect(closeSpy).toHaveBeenCalledOnce();
        vi.restoreAllMocks();
    });
});
