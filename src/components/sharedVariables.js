// sharedVariables.js
import { ethers } from 'ethers';
import contract from './Lock.json';

export const contractAddress = '0x118425febece1EDAC83cE153470A88e3bBf96d87';
const infuraProvider = new ethers.JsonRpcProvider(
    'https://sepolia.infura.io/v3/cdf2a29bbe4a45218e91aaaa2aa87b9a'
  );

export const contractInstance = new ethers.Contract(
    contractAddress,
    contract.abi,
    infuraProvider
  );

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
export const sendContract = new ethers.Contract(
      contractAddress,
      contract.abi,
      signer
    );
