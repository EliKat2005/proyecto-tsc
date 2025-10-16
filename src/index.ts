"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

import * as readline from 'readline';

// Configurar readline para leer desde la entrada estándar
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para preguntar nombre y edad
function preguntarDatos() {
  rl.question('¿Cuál es tu nombre? ', (nombre) => {
    rl.question('¿Cuál es tu edad? ', (edad) => {
      const edadNumero = parseInt(edad);
      if (isNaN(edadNumero)) {
        console.log('Por favor, ingresa un número válido para la edad.');
      } else {
        console.log(`Hola, ${nombre}. Tienes ${edadNumero} años.`);
      }
      rl.close();
    });
  });
}

// Función para calcular el promedio de notas
function promedioNotas(){
  rl.question('¿Cuántas notas deseas ingresar? ', (cantidad) => {
    const numNotas = parseInt(cantidad);
    if (isNaN(numNotas) || numNotas <= 0) {
      console.log('Por favor, ingresa un número válido mayor que cero.');
      rl.close();
      return;
    }

    let notas: number[] = [];
    let contador = 0;

    const preguntarNota = () => {
      if (contador < numNotas) {
        rl.question(`Ingresa la nota ${contador + 1}: `, (nota) => {
          const notaNumero = parseFloat(nota);
          if (isNaN(notaNumero) || notaNumero < 0 || notaNumero > 10) {
            console.log('Por favor, ingresa una nota válida entre 0 y 10.');
          } else {
            notas.push(notaNumero);
            contador++;
          }
          preguntarNota();
        });
      } else {
        const suma = notas.reduce((a, b) => a + b, 0);
        const promedio = suma / notas.length;
        console.log(`El promedio de las notas es: ${promedio.toFixed(2)}`);
        rl.close();
      }
    };
    preguntarNota();
  }); 
}

// Función para hacer preguntas de manera asincrónica
function preguntaAsincrona(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (respuesta) => {
      resolve(respuesta);
    });
  });
}

// Función asincrónica para calcular el promedio de notas
async function promNotas(){
  try{
    const cantidad = await preguntaAsincrona('¿Cuántas notas deseas ingresar? ');
    const numNotas = parseInt(cantidad);
    const notas: number[] = [];
    let suma = 0;
    let promedio = 0;

    if (isNaN(numNotas) || numNotas <= 0) {
      console.log('Por favor, ingresa un número válido mayor que cero.');
      rl.close();
      return;
    }
/* 
    for (let i = 0; i < numNotas; i++) {
      const notaStr = await preguntaAsincrona(`Ingresa la nota ${i + 1}: `);
      const notaNumero = parseFloat(notaStr);
      if (isNaN(notaNumero) || notaNumero < 0 || notaNumero > 10) {
        console.log('Por favor, ingresa una nota válida entre 0 y 10.');
        i--;
      } else {
        notas.push(notaNumero);
      }
    }
      */   
    while (notas.length < numNotas) {
      const notaStr = await preguntaAsincrona(`Ingresa la nota ${notas.length + 1}: `);
      const notaNumero = parseFloat(notaStr);
      if (isNaN(notaNumero) || notaNumero < 0 || notaNumero > 10) {
        console.log('Por favor, ingresa una nota válida entre 0 y 10.');
      } else {
        notas.push(notaNumero);
      }
    }

    suma = notas.reduce((a, b) => a + b, 0);
    promedio = suma / notas.length;

    console.log(`El promedio de las notas es: ${promedio.toFixed(2)}`);
    rl.close();
  } catch(error){
    console.error('Error:', error);
    rl.close();
  }
}






// Llamar a las funciones

promNotas();
//preguntarDatos();
//promedioNotas();



