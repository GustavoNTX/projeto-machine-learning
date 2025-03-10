import * as tf from "@tensorflow/tfjs";
import { athletes } from "../data/athletes";

// Converter categorias para números
const categories = [...new Set(athletes.map(a => a.category))];
const categoryToIndex = (category: string) => categories.indexOf(category);

// Normalizar os dados
const normalizeData = (data: { speed: number, strength: number, endurance: number }) => {
    const minSpeed = Math.min(...athletes.map(a => a.speed));
    const maxSpeed = Math.max(...athletes.map(a => a.speed));
    const minStrength = Math.min(...athletes.map(a => a.strength));
    const maxStrength = Math.max(...athletes.map(a => a.strength));
    const minEndurance = Math.min(...athletes.map(a => a.endurance));
    const maxEndurance = Math.max(...athletes.map(a => a.endurance));

    const normalize = (value: number, min: number, max: number) => (value - min) / (max - min);

    return {
        speed: normalize(data.speed, minSpeed, maxSpeed),
        strength: normalize(data.strength, minStrength, maxStrength),
        endurance: normalize(data.endurance, minEndurance, maxEndurance)
    };
};

// Separar dados em treino e teste (70/30)
const shuffledAthletes = [...athletes].sort(() => Math.random() - 0.5);
const splitIndex = Math.floor(athletes.length * 0.7);
const trainData = shuffledAthletes.slice(0, splitIndex);
const testData = shuffledAthletes.slice(splitIndex);

// Criar tensores normalizados
const xsTrain = tf.tensor2d(trainData.map(({ speed, strength, endurance }) => {
    const normalized = normalizeData({ speed, strength, endurance });
    return [normalized.speed, normalized.strength, normalized.endurance];
}));

const ysTrain = tf.tensor2d(trainData.map(({ category }) => [categoryToIndex(category)]));

const xsTest = tf.tensor2d(testData.map(({ speed, strength, endurance }) => {
    const normalized = normalizeData({ speed, strength, endurance });
    return [normalized.speed, normalized.strength, normalized.endurance];
}));

const ysTest = tf.tensor2d(testData.map(({ category }) => [categoryToIndex(category)]));

// Criar modelo de rede neural
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [3], units: 16, activation: "relu" }));
model.add(tf.layers.dense({ units: 16, activation: "relu" }));
model.add(tf.layers.dense({ units: categories.length, activation: "softmax" }));

// Compilar modelo
model.compile({
    optimizer: tf.train.adam(0.01),
    loss: "sparseCategoricalCrossentropy",
    metrics: ["accuracy"],
});

// Treinar o modelo
export const trainModel = async () => {
    await model.fit(xsTrain, ysTrain, {
        epochs: 200,
        callbacks: {
            onEpochEnd: (epoch, logs) => console.log(`Época ${epoch + 1}: Loss = ${logs?.loss}`),
        },
    });

    // Avaliar precisão
    const evaluation = model.evaluate(xsTest, ysTest) as tf.Tensor[];
    const accuracy = (await evaluation[1].data())[0];
    console.log(`✅ Precisão do Modelo: ${(accuracy * 100).toFixed(2)}%`);
    return `${(accuracy * 100).toFixed(2)}%`;
};

// Prever categoria de um novo atleta
export const predictCategory = async (speed: number, strength: number, endurance: number) => {
    const normalized = normalizeData({ speed, strength, endurance });

    const inputTensor = tf.tensor2d([[normalized.speed, normalized.strength, normalized.endurance]]);

    const prediction = model.predict(inputTensor) as tf.Tensor;
    const predictionData = await prediction.data();
    const predictedIndex = predictionData.indexOf(Math.max(...predictionData));

    return categories[predictedIndex];
};
