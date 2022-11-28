export interface GenericEventInterface<T> {
    addListener(listener: (arg: T) => void): void;
    removeListener(listener: (arg: T) => void): void;
}
export default class GenericEvent<T> implements GenericEventInterface<T> {
    private listeners;
    addListener(listener: (arg: T) => void): void;
    removeListener(listener: (arg: T) => void): void;
    dispatch(arg: T): void;
}
//# sourceMappingURL=generic-events.d.ts.map