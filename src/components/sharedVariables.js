// sharedVariables.js
import { ethers } from 'ethers';
import contract from './Lock.json';

export const contractAddress = '0x062FF859c614200b018857c73B1d4A2e64eBd740';
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
