const animalsNameList = async () => {
    try {
    const response = await fetch('../src/data/animals.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const nameList = await response.json();
        
        return nameList;
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        return [];
    }
};

let availableAnimals = [];

export const randomAnimalName = async () => {
    if (availableAnimals.length === 0) {
        availableAnimals = await animalsNameList();
    }

    if (availableAnimals.length > 0) {
        
        const randomIndex = Math.floor(Math.random() * availableAnimals.length);
        const randomName = availableAnimals[randomIndex];
        availableAnimals.splice(randomIndex, 1); 

        console.log(randomName); 
        return randomName; 
    } else {
        console.log('Todos os nomes já foram sorteados!');
        return null; 
    }
};