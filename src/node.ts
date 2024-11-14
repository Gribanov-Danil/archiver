export class Node {
    public readonly Symbol: string | undefined;
    public readonly Freq: number;
    public readonly Bit0: Node | undefined;
    public readonly Bit1: Node | undefined;

    constructor(options: {symbol?: string, freq: number, bit0?: Node, bit1?: Node}) {
        const {symbol, bit0, bit1, freq} = options
        this.Symbol = symbol;
        this.Freq = freq;
        this.Bit0 = bit0
        this.Bit1 = bit1
        this.Freq = freq
    };

}
