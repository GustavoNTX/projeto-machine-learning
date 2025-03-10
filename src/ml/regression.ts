import * as tf from "@tensorflow/tfjs";
import { athletes } from "../data/athletes";

// Preparar os dados
const inputs = athletes.map(({ speed, strength, endurance }) => [speed, strength, endurance]);
const outputs = athletes.map(({ speed, strength, endurance }) => {
    const performance = speed * 0.4 + strength * 0.4 + endurance * 0.2; // Example calculation
    return [performance];
});

const xs = tf.tensor2d(inputs, [inputs.length, 3]);
const ys = tf.tensor2d(outputs, [outputs.length, 1]);

// Criar modelo de regressão linear
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [3], units: 1 }));

// Compilar o modelo
model.compile({ optimizer: tf.train.sgd(0.01), loss: "meanSquaredError" });

export const trainRegression = async () => {
    console.log("Treinando modelo de regressão linear...");

    await model.fit(xs, ys, {
        epochs: 100,
        batchSize: 8,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                if ((epoch + 1) % 10 === 0) {
                    console.log(`Época ${epoch + 1}: Loss = ${logs?.loss?.toFixed(4)}`);
                }
            },
        },
    });

    console.log("Treinamento concluído!");
};

export const predictPerformance = async (speed: number, strength: number, endurance: number): Promise<number> => {
    const inputTensor = tf.tensor2d([[speed, strength, endurance]], [1, 3]);
    const prediction = model.predict(inputTensor) as tf.Tensor;
    const result = (await prediction.data())[0];
    return parseFloat(result.toFixed(2));
};
