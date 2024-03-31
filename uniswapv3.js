const ethers = require('ethers')
const fs = require('fs');

const v3PoolArtifact = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json")

const USDC_ETH_V3 = '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640'
const DAI_USDC_V3 = '0x5777d92f208679db4b9778590fa3cab3ac9e2168'
const ETH_USDT_V3 = '0x4e68ccd3e89f51c3074ca5072bbac773960dfa36'


const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/002d8b6de0484293b5f625a38e5416bb')

const v3Pool_USDC_ETH_V3 = new ethers.Contract(USDC_ETH_V3, v3PoolArtifact.abi, provider)
const v3Pool_DAI_USDC_V3 = new ethers.Contract(DAI_USDC_V3, v3PoolArtifact.abi, provider)
const v3Pool_ETH_USDT_V3 = new ethers.Contract(ETH_USDT_V3, v3PoolArtifact.abi, provider)


// Define a function to log to console and store in a file
function logAndStore(TOKEN, sender, type, token1_volume, token2_volume,) {
    const log = {
        TOKEN,
        sender,
        type,
        token1_volume,
        token2_volume,
    };
    console.log(log);
    let logs = [];
    try {
        if (fs.existsSync('v3_outputs.json')) {
            logs = JSON.parse(fs.readFileSync('v3_outputs.json', 'utf8')) || [];
        }
    } catch (error) {
        console.error('Error reading or parsing JSON file:', error);
    }
    logs.push(log);
    fs.writeFileSync('v3_outputs.json', JSON.stringify(logs, null, 2));
}



v3Pool_USDC_ETH_V3.on('Swap', async (sender, amount0In, amount1In, amount0Out, amount1Out,to,event) => {
    const type = amount0In.toString() === '0' ? 'sell' : 'buy';
    const token1_volume = type === 'sell' ? amount0Out.toString() : amount0In.toString();
    const token2_volume = type === 'sell' ? amount1In.toString() : amount1Out.toString();
    logAndStore('USDC/ETH', sender, type, token1_volume, token2_volume);
});

v3Pool_DAI_USDC_V3.on('Swap', async (sender, amount0In, amount1In, amount0Out, amount1Out,to,event) => {
    const type = amount0In.toString() === '0' ? 'sell' : 'buy';
    const token1_volume = type === 'sell' ? amount0Out.toString() : amount0In.toString();
    const token2_volume = type === 'sell' ? amount1In.toString() : amount1Out.toString();
    logAndStore('DAI/USDC', sender, type, token1_volume, token2_volume);
});

v3Pool_ETH_USDT_V3.on('Swap', async (sender, amount0In, amount1In, amount0Out, amount1Out,to,event) => {
    const type = amount0In.toString() === '0' ? 'sell' : 'buy';
    const token1_volume = type === 'sell' ? amount0Out.toString() : amount0In.toString();
    const token2_volume = type === 'sell' ? amount1In.toString() : amount1Out.toString();
    logAndStore('ETH/USDT', sender, type, token1_volume, token2_volume);
});




