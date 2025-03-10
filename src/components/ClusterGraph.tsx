import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController } from 'chart.js';
import { Chart } from 'react-chartjs-2';

// Registrar todos os componentes necessários
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    BarController
);

const ClusterGraph: React.FC = () => {
    // Ref para o canvas
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Dados para o gráfico
    const data = {
        labels: ['Corredor', 'Halterofilista', 'Triatleta', 'Levantador de Peso', 'Velocista', 'Maratonista', 'Ciclista', 'Lutador', 'Jogador de Futebol', 'Jogador de Rugby'],
        datasets: [
            {
                label: 'Grupo de Atletas',
                data: [2, 1, 0, 1, 2, 0, 0, 1, 2, 0],
                backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFD700', '#800080', '#00FF7F', '#FF6347', '#8A2BE2', '#7FFF00'],
                borderColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFD700', '#800080', '#00FF7F', '#FF6347', '#8A2BE2', '#7FFF00'],
                borderWidth: 1,
            }
        ]
    };

    // Destruir o gráfico anterior quando o componente for desmontado ou atualizado
    useEffect(() => {
        // Verificar se o canvasRef está referenciando um canvas e se existe um gráfico ativo
        if (canvasRef.current) {
            const chart = new ChartJS(canvasRef.current, {
                type: 'bar',
                data,
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Agrupamento de Atletas'
                        },
                        tooltip: {
                            enabled: true
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Limpeza para destruir o gráfico quando o componente for desmontado
            return () => {
                chart.destroy();
            };
        }
    }, [data]);

    return (
        <div>
            <h2>Visualização dos Grupos de Atletas</h2>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default ClusterGraph;
