"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

import * as readline from 'readline';

// Configurar readline para leer desde la entrada estándar
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

// Llamar a la función para iniciar el proceso de preguntas
preguntarDatos();





function greeter(name: string) {
  return `Hola, ${name}! — desde TypeScript y Node ${process.version}`;
}
console.log(greeter("Elikat"));
