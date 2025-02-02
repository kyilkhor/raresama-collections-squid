
export const CHAIN_NODE = process.env.CHAIN_NODE ||  "wss://wss.api.moonriver.moonbeam.network";
export const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS || "0x6EfEBBb65ea30A0620D221E4519cfab51157dF11".toLowerCase();
export const UPDATE_RATE = BigInt(process.env.UPDATE_RATE || 6*60*60*1000); // 6 hours
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
export const TOKEN_RELATIONS = {
    metadata: true,
    contract: true,
    owner: true
  }