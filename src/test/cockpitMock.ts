const cockpit = {
    http: () => ({
        get: () => Promise.resolve("{}"),
        post: () => Promise.resolve("{}"),
        request: () => Promise.resolve("{}"),
        close: () => {},
    }),
    location: {
        go: () => {},
        replace: () => {},
        path: [] as string[],
        options: {},
        href: "",
    },
    user: () => Promise.resolve({ name: "test", id: 1000, gid: 1000, groups: [], home: "/home/test", shell: "/bin/bash" }),
    transport: { wait: () => Promise.resolve(undefined), close: () => {}, options: {} },
    channel: () => ({
        send: () => {},
        close: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
    }),
    spawn: () => ({
        then: () => Promise.resolve(""),
        stream: () => ({ then: () => Promise.resolve("") }),
        close: () => {},
    }),
};

export default cockpit;
