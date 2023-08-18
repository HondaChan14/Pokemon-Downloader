import fetch from 'node-fetch';
import inquirer from 'inquirer';
import { parseOptions } from './saveFile.js'

// Ask for the Pokemon Name
const promptForPokemon = async () => {
    return await inquirer.prompt({
        type: 'input',
        name: 'pokemon_name',
        message: 'Pokemon name: ',
    });
};

// Ask which information they want from selected pokemon
const promptForDownloadInfo = async () => {
    return await inquirer.prompt({
        type: 'checkbox',
        name: 'options',
        message: 'Pokemon info to download: ',
        choices: [
            new inquirer.Separator("-- Options --"),
            {
                name: "Stats"
            },
            {
                name: "Sprites"
            },
            {
                name: "Artwork"
            }
        ]
    })
}

// Ask if they wanna redo the process for another Pokemon
const promptToContinue = async () => {
    return await inquirer.prompt({
        type: 'list',
        message: 'Would you like to search for another pokemon?',
        name: 'continue',
        choices: [ "Yes", "No"]
    });
}

// Fetch from the API and return the JSON Object
const fetchPokemon = async (pokemonName) => {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    
    const response = await fetch(apiUrl);
    const json = await response.json();
    return json;
}

// The initial Prompt
const promptUser = async () => {
    while (true){
        // Grab user input
        const pokemonName = await promptForPokemon();
        // Fetch pokemon json
        const pokemonJSON = await fetchPokemon(pokemonName.pokemon_name.toLowerCase());
        // List options to download
        const pokemonOptions = await promptForDownloadInfo();
        await parseOptions(pokemonJSON, pokemonOptions)
        // Prompt user with question
        const keepGoing = await promptToContinue();
        if(keepGoing.continue === "No") break;
    }
}

export { promptUser }
