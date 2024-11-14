type HuffmanNode = {
    char?: string;
    freq: number;
    left?: HuffmanNode;
    right?: HuffmanNode;
};

export class HuffmanCompressor {
    private frequencyTable: Map<string, number> = new Map();
    private huffmanCodes: Map<string, string> = new Map();
    private root: HuffmanNode | null = null;

    constructor() {}

    private buildFrequencyTable(text: string): void {
        for (const char of text) {
            const count = this.frequencyTable.get(char) || 0;
            this.frequencyTable.set(char, count + 1);
        }
    }

    private buildHuffmanTree(): void {
        const nodes: HuffmanNode[] = [];

        this.frequencyTable.forEach((freq, char) => {
            nodes.push({ char, freq });
        });

        while (nodes.length > 1) {
            nodes.sort((a, b) => a.freq - b.freq);

            const left = nodes.shift()!;
            const right = nodes.shift()!;
            const newNode: HuffmanNode = {
                freq: left.freq + right.freq,
                left,
                right,
            };

            nodes.push(newNode);
        }

        this.root = nodes[0];
    }

    private buildCodes(node: HuffmanNode | undefined | null, code: string): void {
        if (!node) return;

        if (node.char) {
            this.huffmanCodes.set(node.char, code);
        }

        this.buildCodes(node.left, code + "0");
        this.buildCodes(node.right, code + "1");
    }

    public compress(text: string): string {
        this.buildFrequencyTable(text);
        this.buildHuffmanTree();
        this.buildCodes(this.root, "");

        let compressedText = "";
        for (const char of text) {
            compressedText += this.huffmanCodes.get(char);
        }
        return compressedText;
    }

    public decompress(compressedText: string): string {
        let decodedText = "";
        let node = this.root;

        for (const bit of compressedText) {
            node = (bit === "0" ? node?.left : node?.right) || null;

            if (node?.char) {
                decodedText += node.char;
                node = this.root;
            }
        }

        return decodedText;
    }

    public getCodes(): Map<string, string> {
        return this.huffmanCodes;
    }


    private calculateEntropy(): number {
        const n = this.frequencyTable.size;
        return Math.log2(n);
    }

    private calculateAverageCodeLength(): number {
        let L_cp = 0;
        const totalSymbols = Array.from(this.frequencyTable.values()).reduce((a, b) => a + b, 0);

        for (const [char, freq] of this.frequencyTable) {
            const probability = freq / totalSymbols;
            const codeLength = this.huffmanCodes.get(char)?.length || 0;
            L_cp += probability * codeLength;
        }

        return L_cp;
    }

    public getCompressionRatio(): number {
        const H_max = this.calculateEntropy();
        const L_cp = this.calculateAverageCodeLength();
        if (L_cp === 0) return 0;
        return H_max / L_cp;
    }
    private calculateCompressionEfficiencyEntropy(): number {
        const totalSymbols = Array.from(this.frequencyTable.values()).reduce((a, b) => a + b, 0);
        let entropy = 0;

        for (const [, freq] of this.frequencyTable) {
            const probability = freq / totalSymbols;
            entropy -= probability * Math.log2(probability);
        }

        return entropy;
    }

    public getCompressionEfficiency(): number {
        const H = this.calculateCompressionEfficiencyEntropy();
        const L_cp = this.calculateAverageCodeLength();
        if (L_cp === 0) return 0;
        return H / L_cp;
    }
}
