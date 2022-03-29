import algosdk from 'algosdk';

const server = window.__RUNTIME_CONFIG__.REACT_APP_ALGORAND_SERVER;
const token = { 'X-API-Key': window.__RUNTIME_CONFIG__.REACT_APP_ALGORAND_TOKEN_KEY };
const port = '';
const indexer_server = window.__RUNTIME_CONFIG__.REACT_APP_ALGORAND_PURESTAKE_INDEXER_SERVER;

export const algorandBaseUrl = window.__RUNTIME_CONFIG__.REACT_APP_ALGORAND_BASE_URL;

export function getAlgodClient() {
    return new algosdk.Algodv2(token, server, port);
}

export function getAlgodIndexer() {
    return new algosdk.Indexer(token, indexer_server, port);
}
