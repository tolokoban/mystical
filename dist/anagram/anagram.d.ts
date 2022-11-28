import GenericEvent from "../tools/generic-events";
export default class Anagram {
    readonly eventReady: GenericEvent<void>;
    readonly eventSolution: GenericEvent<string[]>;
    private readonly worker;
    constructor();
    find(input: string): void;
    private post;
    private readonly handleWorkerMessage;
}
//# sourceMappingURL=anagram.d.ts.map