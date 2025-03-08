import * as tf from "@tensorflow/tfjs";
import { athletes } from "../data/athletes";

// Converter categorias para números
const categories = [...new Set(athletes.map(a => a.category))];
const categoryToIndex = (category: string) => categories.indexOf(category);

// Embaralhar os dados (importante para evitar viés no treino)
const shuffledAthletes = athletes.sort(() => Math.random() - 0.5);

// Separar 70% para treino e 30% para teste
const splitIndex = Math.floor(athletes.length * 0.7);
const trainData = shuffledAthletes.slice(0, splitIndex);
const testData = shuffledAthletes.slice(splitIndex);

// Criar dados de entrada (X) e saída (Y) para treino
const xsTrain = tf.tensor2d(trainData.map(({ speed, strength, endurance }) => [speed, strength, endurance]));
const ysTrain = tf.tensor2d(trainData.map(({ category }) => categoryToIndex(category)), [trainData.length, 1]);

// Criar dados de entrada (X) e saída (Y) para teste
const xsTest = tf.tensor2d(testData.map(({ speed, strength, endurance }) => [speed, strength, endurance]));
const ysTest = tf.tensor2d(testData.map(({ category }) => categoryToIndex(category)), [testData.length, 1]);

// Criar o modelo
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [3], units: 16, activation: "relu" })); // Aumentar unidades
model.add(tf.layers.dense({ units: 16, activation: "relu" })); // Camada extra
model.add(tf.layers.dense({ units: categories.length, activation: "softmax" })); // Saída


// Compilar o modelo
model.compile({
    optimizer: tf.train.adam(0.01),
    loss: "sparseCategoricalCrossentropy",
    metrics: ["accuracy"],
});

// Treinar o modelo e testar precisão
export const trainAndEvaluate = async () => {
    await model.fit(xsTrain, ysTrain, {
        epochs: 200,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Época ${epoch + 1}: Loss = ${logs?.loss}`);
            },
        },
    });

    // Avaliar a precisão no conjunto de teste
    const evaluation = model.evaluate(xsTest, ysTest) as tf.Tensor[];
    const accuracyTensor = evaluation[1];
    const accuracy = (await accuracyTensor.data())[0];

    console.log(`Precisão do modelo: ${(accuracy * 200).toFixed(2)}%`);

    return `${(accuracy * 200).toFixed(2)}%`; // Agora a função retorna a precisão como string ✅
};

export const predictCategory = async (speed: number, strength: number, endurance: number) => {
    // Criar um tensor com os dados do atleta
    const inputTensor = tf.tensor2d([[speed, strength, endurance]]);

    // Fazer a previsão usando o modelo treinado
    const prediction = model.predict(inputTensor) as tf.Tensor;
    const predictionData = await prediction.data();

    // Achar o índice da categoria com maior probabilidade
    const predictedIndex = predictionData.indexOf(Math.max(...predictionData));

    return categories[predictedIndex]; // Retorna o nome da categoria
};
