require("dotenv").config();

const aptos = require("aptos");

const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com/v1";

const FAUCET_URL= process.env.APTOS_FAUCET_URL || "https://faucet.devnet.aptoslabs.com/"

const aptoscoin = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>";


(async ()=>{
    const client = new aptos.AptosClient(NODE_URL);
    const faucetClient = new aptos.FaucetClient(NODE_URL, FAUCET_URL, null);
    const privatekey = new aptos.HexString("0x9bc91de170900b0f2ff8a6c19f3bef381f330173a89a28f679c9b85011e018a0");
    const account1 = new aptos.AptosAccount(privatekey.toUint8Array());

    // await faucetClient.fundAccount(account1.address(), 10000000);
    // await faucetClient.fundAccount(account1.address(), 100_000_000);

    console.log(`account1 address :${account1.address()}`)

    let resources = await client.getAccountResources(account1.address());

    let accountresource = resources.find((r) => r.type == aptoscoin);

    console.log(`account2 coins ${accountresource.data.coin.value} should be 1000000`);


    const payload = {
        type: "entry_function_payload",
        function: "d2d5d5a71677ece338669d614d6ab1b100e3d8803772f9deac263c764aa0d53c::MyCounter::incre_counter",
        type_arguments:["address"],
        arguments: [account1.address().hex()],
    };

    const payload2 = {
        type: "entry_function_payload",
        function:"0x1::coin::transfer",
        type_arguments: ["0x::aptos_coin::AptosCoin"],
        arguments: [account1.address().hex(),717]

    }

    try{
        const txnrequest = await client.generateTransaction(account1.address(), payload);
        const signedTxn = await client.signTransaction(account1, txnrequest);
        const transactions = await client.submitTransaction(signedTxn);
        await client.waitForTransaction(transactions.hash);
        console.log(transactions.hash)
    }catch(err){
        console.log(err);

    }

  
})();