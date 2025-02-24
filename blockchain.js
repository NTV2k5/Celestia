const SHA256 = require('crypto-js/sha256');
export class Block
{
    constructor(index, timestamp, data, previousHash = '')
    {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.prevHash = previousHash;
        this.hash = this.calculateHash();
    }
    calculateHash()
    {
        return SHA256 (this.index + this.prevHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}
export class BlockChain
{
    constructor()
    {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock()
    {
        return new Block(0,"01/01/2025", "Genesis block", "0");
    }
    getLatestBlock()
    {
        return this.chain[this.chain.length - 1]
    }
    // thêm khối 
    addBlock(newBlock)
    {
        newBlock.prevHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
    isChainValid() 
    {
     // Kiểm tra tính hợp lệ của từng block trong chuỗi
        for (let i = 1; i < this.chain.length; i++) 
        {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            // Kiểm tra mã băm của block hiện tại
            if (currentBlock.hash !== currentBlock.calculateHash()) 
            {
                return false;
            }

            // Kiểm tra mã băm của block trước đó
            if (currentBlock.prevHash !== previousBlock.hash) 
            {
                return false;
            }
        }
        return true; // Di chuyển return true ra ngoài vòng lặp
    }
}
exports = { Block, BlockChain };