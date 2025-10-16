import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function preguntar(pregunta: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(pregunta, (respuesta) => {
      resolve(respuesta);
    });
  });
}

// Función tarea
async function evaluarEmpleados(): Promise<void> {
  try {
    console.log('=== EVALUACIÓN DE EMPLEADOS ===\n');

    // Num empleados
    const cantidadTexto = await preguntar('¿Cuántos empleados vas a evaluar? ');
    const cantidad = parseInt(cantidadTexto);

    if (isNaN(cantidad) || cantidad <= 0) {
      console.log('Tienes que ingresar un número válido, mayor que cero.');
      return;
    }

    console.log(`\nVamos a evaluar ${cantidad} empleado(s)\n`);

    // Guardar empleados
    const empleados: Array<{nombre: string, evaluacion: number}> = [];
    let sumaTotal = 0;
    let empleadosDestacados = 0;
    let mejorEmpleado = { nombre: '', evaluacion: -1 };
    let peorEmpleado = { nombre: '', evaluacion: 11 };

    // Pedir datos
    for (let i = 0; i < cantidad; i++) {
      console.log(`--- Empleado ${i + 1} ---`);
      
      // Pedir nombre
      let nombre = '';
      while (nombre.trim() === '') {
        nombre = await preguntar('Nombre: ');
        if (nombre.trim() === '') {
          console.log('El nombre no puede estar vacío');
        }
      }

      // Pedir evaluación
      let evaluacion = -1;
      while (evaluacion < 0 || evaluacion > 10) {
        const evalTexto = await preguntar('Evaluación (0-10): ');
        evaluacion = parseFloat(evalTexto);
        
        if (isNaN(evaluacion) || evaluacion < 0 || evaluacion > 10) {
          console.log('La evaluación debe ser un número entre 0 y 10');
        }
      }

      // Guardar el empleado
      empleados.push({ nombre: nombre.trim(), evaluacion });
      
      // Calcular estadísticas
      sumaTotal += evaluacion;
      
      if (evaluacion > 7) {
        empleadosDestacados++;
      }
      
      if (evaluacion > mejorEmpleado.evaluacion) {
        mejorEmpleado = { nombre: nombre.trim(), evaluacion };
      }
      
      if (evaluacion < peorEmpleado.evaluacion) {
        peorEmpleado = { nombre: nombre.trim(), evaluacion };
      }
      
      console.log('');
    }

    // Mostrar resultados
    console.log('\n=== RESULTADOS ===');
    
    // Lista de empleados
    console.log('\nEmpleados evaluados:');
    empleados.forEach((emp, i) => {
      console.log(`  ${i + 1}. ${emp.nombre} - ${emp.evaluacion}/10`);
    });

    // Estadísticas
    const promedio = sumaTotal / cantidad;
    console.log(`\nEstadísticas:`);
    console.log(`  • Promedio general: ${promedio.toFixed(1)}/10`);
    console.log(`  • Empleados destacados (>7): ${empleadosDestacados}`);
    console.log(`  • Mejor evaluación: ${mejorEmpleado.nombre} (${mejorEmpleado.evaluacion}/10)`);
    console.log(`  • Peor evaluación: ${peorEmpleado.nombre} (${peorEmpleado.evaluacion}/10)`);

    // Comentario sobre el promedio
    console.log('\nAnálisis:');
    if (promedio >= 8) {
      console.log('  ¡Excelente! El equipo está funcionando muy bien');
    } else if (promedio >= 6) {
      console.log('  Buen desempeño, pero hay espacio para mejorar');
    } else {
      console.log('  Necesitan mejorar como equipo');
    }

  } catch (error) {
    console.log('Ocurrió un error:', error);
  }
}

// Programa principal 
async function main() {
  console.log('Bienvenido al sistema de evaluación\n');
  
  let otraEvaluacion = true;
  
  while (otraEvaluacion) {
    await evaluarEmpleados();
    
    const respuesta = await preguntar('\n¿Quieres hacer otra evaluación? (s/n): ');
    otraEvaluacion = respuesta.toLowerCase() === 's';
    
    if (otraEvaluacion) {
      console.log('\n' + '='.repeat(30) + '\n');
    }
  }
  
  console.log('\n¡Gracias por usar el sistema!');
  rl.close();
}

// Iniciar el programa
main();