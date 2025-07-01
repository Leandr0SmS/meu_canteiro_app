export const config = { 
    meuCanteiroApi: 'http://127.0.0.1:5000',
    agroforestrySystemsDesignAPI: 'http://127.0.0.1:5001',
    brasilApi:'https://brasilapi.com.br/api/cptec/v1/',
    quotesAPI: 'https://qapi.vercel.app/api/random',
    MyMemorytranlateAPI: 'https://api.mymemory.translated.net/'
};

// Check if running in Electron
if (window.api) {
    console.log('Running in Electron environment');
}
