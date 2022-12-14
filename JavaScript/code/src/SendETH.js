import { ethers } from "ethers";

// 利用Alchemy的rpc节点连接以太坊网络
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.g.alchemy.com/v2/Alchemy_API_KEY';

// 连接Goerli测试网
const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// 创建随机的wallet对象
const wallet1 = ethers.Wallet.createRandom()
const wallet1WithProvider = wallet1.connect(provider)

// 获取钱包1的助记词
const mnemonic = wallet1.mnemonic 

// 利用私钥和provider创建wallet对象
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet2 = new ethers.Wallet(privateKey, provider)

// 从助记词创建wallet对象
const wallet3 = new ethers.Wallet.fromMnemonic(mnemonic.phrase);

// 综上所述，钱包3的wallet对象是通过钱包1的助记词得来的。

const main = async () => {
    // 1. 获取钱包地址 （该钱包地址随机获得）
    const address1 = await wallet1.getAddress();
    const address2 = await wallet2.getAddress();
    const address3 = await wallet3.getAddress(); // 获取地址
    console.log(`1. 获取钱包地址`);
    console.log(`钱包1地址: ${address1}`);
    console.log(`钱包2地址: ${address2}`);
    console.log(`钱包3地址: ${address3}`);
    console.log(`钱包1和钱包3的地址是否相同: ${address1 === address3}`);

    // 2. 获取助记词
    console.log(`\n2. 获取助记词`);
    console.log(`钱包1助记词: ${wallet1.mnemonic.phrase}`)  // 钱包1和钱包3的助记词相同
    // 注意：从private key生成的钱包没有助记词
    // console.log(wallet2.mnemonic.phrase)  // TypeError: Cannot read properties of null (reading 'phrase')

    // 3. 获取私钥
    console.log(`\n3. 获取私钥`);
    console.log(`钱包1私钥: ${wallet1.privateKey}`)
    console.log(`钱包2私钥: ${wallet2.privateKey}`)

    // 4. 获取链上发送交易次数
    console.log(`\n4. 获取链上交易次数`);
    const txCount1 = await wallet1WithProvider.getTransactionCount()
    const txCount2 = await wallet2.getTransactionCount()
    console.log(`钱包1发送交易次数: ${txCount1}`)
    console.log(`钱包2发送交易次数: ${txCount2}`)

    // 5. 发送ETH
    // 先确保wallet2钱包地址里有goerli测试网ETH，如果余额不足需要往里转一点，不然没法交易
    console.log(`\n5. 发送ETH（测试网）`);
    // i. 打印交易前余额
    console.log(`i. 发送前余额`)
    console.log(`钱包1: ${ethers.utils.formatEther(await wallet1WithProvider.getBalance())} ETH`)
    console.log(`钱包2: ${ethers.utils.formatEther(await wallet2.getBalance())} ETH`)

    // ii. 构造交易请求，参数：to为接收地址，value为ETH数额
    const tx = {
        to: address1,
        value: ethers.utils.parseEther("0.001")
    }

    // iii. 发送交易，获得收据
    console.log(`\nii. 等待交易在区块链确认（需要几分钟）`)
    const receipt = await wallet2.sendTransaction(tx)
    await receipt.wait() // 等待链上确认交易
    console.log(receipt) // 打印交易详情

    // iv. 打印交易后余额
    console.log(`\niii. 发送后余额`)
    console.log(`钱包1: ${ethers.utils.formatEther(await wallet1WithProvider.getBalance())} ETH`)
    console.log(`钱包2: ${ethers.utils.formatEther(await wallet2.getBalance())} ETH`)
}

main()