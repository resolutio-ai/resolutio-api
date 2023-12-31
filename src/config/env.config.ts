import path from "path";
import { config } from 'dotenv'

config({
    path: path.resolve(process.cwd(), ".env.test"),
});

// Validate and export the required environment variables
export const LIGHT_API_KEY = validateEnvVariable('LIGHT_API_KEY');
export const PRIVATE_KEY = validateEnvVariable('PRIVATE_KEY');
export const PUBLIC_KEY = validateEnvVariable('PUBLIC_KEY');
export const PORT = validateEnvVariable('PORT');
export const GET_APIKEY_ENDPOINT = validateEnvVariable('GET_APIKEY_ENDPOINT');
export const SIGNED_MESSAGE = validateEnvVariable('SIGNED_MESSAGE');
export const GATEWAY_BASEURL = validateEnvVariable('GATEWAY_BASEURL');
export const CHATBOT_BASEURL = validateEnvVariable('CHATBOT_BASEURL');
export const WEB3_ENVIRONMENT = validateEnvVariable('WEB3_ENVIRONMENT');
export const MAINNET_WHITELIST_CONTRACT_ADDRESS = validateEnvVariable('MAINNET_WHITELIST_CONTRACT_ADDRESS');
export const TESTNET_WHITELIST_CONTRACT_ADDRESS = validateEnvVariable('TESTNET_WHITELIST_CONTRACT_ADDRESS');
export const MAGIC_SECRET_KEY = validateEnvVariable('MAGIC_SECRET_KEY');
export const WEB3STORAGE_TOKEN = validateEnvVariable('WEB3STORAGE_TOKEN');

// Helper function to validate environment variables
function validateEnvVariable(variableName: string) {
    const value = process.env[variableName];
    if (!value) {
        throw new Error(`Missing value for environment variable: ${variableName}`);
    }
    
    return value;
}