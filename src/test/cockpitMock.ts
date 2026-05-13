type Listener = (...args: unknown[]) => void;

let mockResponse = "{}";
const eventListeners: Record<string, Listener[]> = {};
const storage = new Map<string, string>();

let lastGetPath = "";
let lastPostPath = "";
let lastPostBody: string | undefined;
let lastRequestOptions: Record<string, unknown> = {};

const cockpit = {
    __setMockResponse(json: string) {
        mockResponse = json;
    },

    __resetMock() {
        mockResponse = "{}";
        Object.keys(eventListeners).forEach(k => delete eventListeners[k]);
        storage.clear();
        lastGetPath = "";
        lastPostPath = "";
        lastPostBody = undefined;
        lastRequestOptions = {};
    },

    __getLastGetPath: () => lastGetPath,
    __getLastPostPath: () => lastPostPath,
    __getLastPostBody: () => lastPostBody,
    __getLastRequestOptions: () => lastRequestOptions,

    __emitEvent(event: string, ...args: unknown[]) {
        (eventListeners[event] ?? []).forEach(fn => fn(...args));
    },

    http: () => ({
        get: (path: string) => {
            lastGetPath = path;
            return Promise.resolve(mockResponse);
        },
        post: (path: string, body?: string) => {
            lastPostPath = path;
            lastPostBody = body;
            return Promise.resolve(mockResponse);
        },
        request: (options: Record<string, unknown>) => {
            lastRequestOptions = options;
            return Promise.resolve(mockResponse);
        },
        close: () => {},
    }),

    location: {
        go: () => {},
        replace: () => {},
        path: [] as string[],
        options: {} as Record<string, string | string[]>,
        href: "",
    },

    user: () =>
        Promise.resolve({
            name: "test",
            full_name: "Test User",
            id: 1000,
            gid: 1000,
            groups: [] as string[],
            home: "/home/test",
            shell: "/bin/bash",
        }),

    transport: {
        wait: () => Promise.resolve(undefined),
        close: () => {},
        options: {},
    },

    channel: (options?: Record<string, unknown>) => {
        const channelListeners: Record<string, Listener[]> = {};
        return {
            __options: options,
            __emit(event: string, ...args: unknown[]) {
                (channelListeners[event] ?? []).forEach(fn => fn(...args));
            },
            send: () => {},
            close: () => {},
            addEventListener: (event: string, fn: Listener) => {
                if (!channelListeners[event]) channelListeners[event] = [];
                channelListeners[event].push(fn);
            },
            removeEventListener: (event: string, fn: Listener) => {
                const list = channelListeners[event];
                if (list) channelListeners[event] = list.filter(f => f !== fn);
            },
        };
    },

    spawn: () => ({
        then: () => Promise.resolve(""),
        stream: () => ({ then: () => Promise.resolve("") }),
        close: () => {},
    }),

    addEventListener: (event: string, fn: Listener) => {
        if (!eventListeners[event]) eventListeners[event] = [];
        eventListeners[event].push(fn);
    },

    removeEventListener: (event: string, fn: Listener) => {
        const list = eventListeners[event];
        if (list) eventListeners[event] = list.filter(f => f !== fn);
    },

    localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
        clear: () => storage.clear(),
    },
};

export default cockpit;
