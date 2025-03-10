import { kmeans } from "ml-kmeans";
import { athletes } from "../data/athletes";

// Pegar apenas os atributos numéricos (velocidade, força, resistência)
const data = athletes.map(({ speed, strength, endurance }) => [speed, strength, endurance]);

// Definir a quantidade de grupos (podemos testar com 3)
const numClusters = 3;

// Executar o K-Means
const clusters = kmeans(data, numClusters, {});

// Adicionar os rótulos gerados aos atletas
const clusteredAthletes = athletes.map((athlete, index) => ({
    ...athlete,
    cluster: clusters.clusters[index], // O grupo que o atleta pertence
}));

// Exibir os resultados no console
console.log("Atletas agrupados:", clusteredAthletes);

// Opcional: Visualização (se você estiver usando uma biblioteca como o D3.js ou outra)
clusteredAthletes.forEach((athlete) => {
    console.log(`Atleta: ${athlete.category} - Grupo: ${athlete.cluster}`);
});

export default clusteredAthletes;
