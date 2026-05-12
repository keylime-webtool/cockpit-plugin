declare module "cockpit" {
    type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };
    type JsonObject = Record<string, JsonValue>;

    class BasicError {
        problem: string;
        message: string;
        toString(): string;
    }

    type SuperuserMode = "require" | "try" | null | undefined;

    function init(): Promise<void>;
    function assert(predicate: unknown, message?: string): asserts predicate;

    const manifests: { [packageName in string]?: JsonObject };

    let language: string;
    let language_direction: string;

    interface Transport {
        csrf_token: string;
        origin: string;
        host: string;
        options: JsonObject;
        uri(suffix?: string): string;
        wait(callback: (transport: Transport) => void): void;
        close(problem?: string): void;
        application(): string;
        control(command: string, options: JsonObject): void;
    }

    const transport: Transport;

    interface DeferredPromise<T> extends Promise<T> {
        done(callback: (data: T) => void): DeferredPromise<T>;
        fail(callback: (exc: Error) => void): DeferredPromise<T>;
        always(callback: () => void): DeferredPromise<T>;
        progress(callback: (message: T, cancel: () => void) => void): DeferredPromise<T>;
    }

    interface Deferred<T> {
        resolve(): Deferred<T>;
        reject(): Deferred<T>;
        notify(): Deferred<T>;
        promise: DeferredPromise<T>;
    }

    function defer<T>(): Deferred<T>;

    interface EventMap {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [_: string]: (...args: any[]) => void;
    }

    type EventListener<E extends (...args: unknown[]) => void> =
        (event: CustomEvent<Parameters<E>>, ...args: Parameters<E>) => void;

    interface EventSource<EM extends EventMap> {
        addEventListener<E extends keyof EM>(event: E, listener: EventListener<EM[E]>): void;
        removeEventListener<E extends keyof EM>(event: E, listener: EventListener<EM[E]>): void;
        dispatchEvent<E extends keyof EM>(event: E, ...args: Parameters<EM[E]>): void;
    }

    interface CockpitEvents extends EventMap {
        locationchanged(): void;
        visibilitychange(): void;
    }

    function addEventListener<E extends keyof CockpitEvents>(
        event: E, listener: EventListener<CockpitEvents[E]>
    ): void;
    function removeEventListener<E extends keyof CockpitEvents>(
        event: E, listener: EventListener<CockpitEvents[E]>
    ): void;

    interface ChannelEvents<T> extends EventMap {
        control(options: JsonObject): void;
        ready(options: JsonObject): void;
        close(options: JsonObject): void;
        message(data: T): void;
    }

    interface Channel<T> extends EventSource<ChannelEvents<T>> {
        id: string | null;
        binary: boolean;
        options: JsonObject;
        ready: boolean;
        valid: boolean;
        send(data: T): void;
        control(options: { command: string } & JsonObject): void;
        wait(callback?: (data: T) => void): Promise<T>;
        close(options?: string | JsonObject): void;
    }

    interface ChannelOptions {
        superuser?: SuperuserMode;
        [_: string]: JsonValue | undefined;
        binary?: boolean;
        host?: string;
        user?: string;
        password?: string;
        session?: "shared" | "private";
    }

    interface ChannelOpenOptions extends ChannelOptions {
        payload: string;
    }

    function channel(options: ChannelOpenOptions & { binary?: false }): Channel<string>;
    function channel(options: ChannelOpenOptions & { binary: true }): Channel<Uint8Array>;

    class ProcessError {
        problem: string | null;
        exit_status: number | null;
        exit_signal: number | null;
        message: string;
    }

    interface Spawn<T> extends DeferredPromise<T> {
        input(message?: T | null, stream?: boolean): Spawn<T>;
        stream(callback: (data: T) => number | null | void): Spawn<T>;
        done(callback: (data: T, message?: string) => void): Spawn<T>;
        fail(callback: (exc: Error, data?: string) => void): Spawn<T>;
        state(): "pending" | "resolved" | "rejected";
        close(options?: string | JsonObject): void;
    }

    interface SpawnOptions extends ChannelOptions {
        directory?: string;
        err?: "out" | "ignore" | "message";
        environ?: string[];
        pty?: boolean;
        window?: { rows: number; cols: number };
    }

    function spawn(args: string[], options?: SpawnOptions & { binary?: false }): Spawn<string>;
    function spawn(args: string[], options: SpawnOptions & { binary: true }): Spawn<Uint8Array>;

    interface Location {
        url_root: string;
        options: { [name: string]: string | Array<string> };
        path: Array<string>;
        href: string;
        go(path: Location | string[] | string, options?: { [key: string]: string }): void;
        replace(path: Location | string[] | string, options?: { [key: string]: string }): void;
        encode(path: string[], options?: { [key: string]: string }, with_root?: boolean): string;
        decode(string: string, options?: { [key: string]: string }): string[];
    }

    let location: Location;

    function jump(path: string | string[], host?: string): void;

    let hidden: boolean;

    interface TlsCert {
        file?: string;
        data?: string;
    }

    interface HttpOptions {
        address?: string;
        port?: number;
        tls?: {
            authority?: TlsCert;
            certificate?: TlsCert;
            key?: TlsCert;
            validate?: boolean;
        };
        superuser?: SuperuserMode;
        binary?: boolean;
        headers?: HttpHeaders;
        params?: { [key: string]: string | number };
    }

    type HttpHeaders = { [key: string]: string };

    interface HttpRequestOptions {
        path?: string;
        method?: string;
        headers?: HttpHeaders;
        params?: { [key: string]: string | number };
        body?: string | Uint8Array | null;
    }

    interface HttpInstance<TResponse = string> {
        request(options: HttpRequestOptions): Promise<TResponse>;
        get(path: string, options?: Omit<HttpRequestOptions, "method" | "path" | "body">): Promise<TResponse>;
        post(
            path: string,
            body?: string | Uint8Array | JsonObject | null,
            options?: Omit<HttpRequestOptions, "method" | "path" | "body">
        ): Promise<TResponse>;
        close(): void;
    }

    function http(endpoint: string | number): HttpInstance<string>;
    function http(endpoint: string | number, options: HttpOptions & { binary?: false | undefined }): HttpInstance<string>;
    function http(endpoint: string | number, options: HttpOptions & { binary: true }): HttpInstance<Uint8Array>;
    function http(options: HttpOptions & { binary?: false | undefined }): HttpInstance<string>;
    function http(options: HttpOptions & { binary: true }): HttpInstance<Uint8Array>;

    type UserInfo = {
        id: number;
        gid: number;
        name: string;
        full_name: string;
        groups: Array<string>;
        home: string;
        shell: string;
    };

    function user(): Promise<Readonly<UserInfo>>;

    function message(problem: string | JsonObject): string;
    function format(format_string: string, ...args: unknown[]): string;

    function gettext(message: string): string;
    function gettext(context: string, message?: string): string;
    function ngettext(message1: string, messageN: string, n: number): string;
    function ngettext(context: string, message1: string, messageN: string, n: number): string;

    function translate(): void;

    type FormatOptions = {
        precision?: number;
        base2?: boolean;
    };
    type MaybeNumber = number | null | undefined;

    function format_number(n: MaybeNumber, precision?: number): string;
    function format_bytes(n: MaybeNumber, options?: FormatOptions): string;
    function format_bytes_per_sec(n: MaybeNumber, options?: FormatOptions): string;
    function format_bits_per_sec(n: MaybeNumber, options?: FormatOptions & { base2?: false }): string;

    function logout(reload: boolean, reason?: string): void;

    let localStorage: Storage;
    let sessionStorage: Storage;
}
