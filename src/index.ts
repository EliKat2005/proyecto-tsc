import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Definir tipo Empleado
type Empleado = {
  cedula: string;
  nombre: string;
  evaluacion: number;
};

function preguntar(pregunta: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(pregunta, (respuesta) => {
      resolve(respuesta);
    });
  });
}

// Función para listar empleados
function listarEmpleados(empleados: Empleado[]) {
  if (empleados.length === 0) {
    console.log("No hay empleados registrados");
    return;
  }
  console.log("\n--- Lista de Empleados ---");
  empleados.forEach((emp, i) => {
    console.log(`${i + 1}.- ${emp.cedula} - ${emp.nombre} - Evaluación: ${emp.evaluacion}`);
  });
}

// Función para modificar evaluación
async function modificarEvaluacion(empleados: Empleado[]): Promise<void> {
  if (empleados.length === 0) {
    console.log("No hay empleados para modificar");
    return;
  }

  while (true) {
    console.log("\n¿Cómo desea seleccionar al empleado a modificar?");
    console.log("1.- Por número de cédula");
    console.log("2.- Por número de índice");
    console.log("3.- Por nombre");
    console.log("4.- Cancelar");

    const modo = (await preguntar("Digite la opción: ")).trim();

    if (modo === "4") {
      console.log("Operación cancelada");
      return;
    }

    let idx = -1;

    if (modo === "1") {
      listarEmpleados(empleados);
      const cedulaBuscada = (await preguntar("Ingrese la cédula del empleado: ")).trim();
      const encontrado = empleados.findIndex(e => e.cedula === cedulaBuscada);
      
      if (encontrado === -1) {
        console.log("No se encontró ningún empleado con esa cédula, intente nuevamente");
        continue;
      } else {
        idx = encontrado;
      }
    } 
    else if (modo === "2") {
      listarEmpleados(empleados);

      while (true) {
        const nind = await preguntar("Ingrese el índice del empleado a modificar: ");
        const n = parseInt(nind);
        if (Number.isInteger(n) && n >= 1 && n <= empleados.length) {
          idx = n - 1;
          break;
        }
        console.log("Hey! Ingrese un índice real de los mostrados");
      }
    } 
    else if (modo === "3") {
      listarEmpleados(empleados);
      const termino = (await preguntar("Ingrese el nombre del empleado: ")).trim().toLowerCase();
      const coincidencias = empleados
        .map((e, i) => ({ i, e }))
        .filter(x => x.e.nombre.toLowerCase().includes(termino));

      if (coincidencias.length === 0) {
        console.log("No se encontraron coincidencias, intente nuevamente");
        continue;
      } else if (coincidencias.length === 1) {
        idx = coincidencias[0].i;
      } else {
        console.log("\nSe encontraron múltiples coincidencias:");
        coincidencias.forEach((x, k) => {
          console.log(`${k + 1}. ${empleados[x.i].nombre} - Cédula: ${empleados[x.i].cedula} - Nota: ${empleados[x.i].evaluacion}`);
        });
        
        while (true) {
          const elec = await preguntar("Seleccione una opción por número: ");
          const sel = parseInt(elec);
          if (Number.isInteger(sel) && sel >= 1 && sel <= coincidencias.length) {
            idx = coincidencias[sel - 1].i;
            break;
          }
          console.log("Selección inválida, intente nuevamente");
        }
      }
    }
    else {
      console.log("Selección inválida, intente nuevamente");
      continue;
    }

    // Mostrar empleado seleccionado
    const empleado = empleados[idx];
    console.log(`\nEmpleado seleccionado: ${empleado.nombre} (Cédula: ${empleado.cedula})`);
    console.log(`Evaluación actual: ${empleado.evaluacion}`);

    // Pedir nueva evaluación
    let nuevaEvaluacion = -1;
    while (nuevaEvaluacion < 0 || nuevaEvaluacion > 10) {
      const evalTexto = await preguntar('Nueva evaluación (0-10): ');
      nuevaEvaluacion = parseFloat(evalTexto);
      
      if (isNaN(nuevaEvaluacion) || nuevaEvaluacion < 0 || nuevaEvaluacion > 10) {
        console.log('La evaluación debe ser un número entre 0 y 10');
      }
    }

    // Confirmar cambio
    const confirmar = await preguntar(`¿Confirmar cambio de ${empleado.evaluacion} a ${nuevaEvaluacion} para ${empleado.nombre}? (s/n): `);
    
    if (confirmar.toLowerCase() === 's') {
      empleado.evaluacion = nuevaEvaluacion;
      console.log(`Evaluación de ${empleado.nombre} actualizada a ${nuevaEvaluacion}`);
    } else {
      console.log("Cambio cancelado");
    }

    break;
  }
}

// Función para evaluar empleados
async function evaluarEmpleados(): Promise<Empleado[]> {
  try {
    console.log('=== EVALUACIÓN DE EMPLEADOS ===\n');

    // Num empleados
    const cantidadTexto = await preguntar('¿Cuántos empleados vas a evaluar? ');
    const cantidad = parseInt(cantidadTexto);

    if (isNaN(cantidad) || cantidad <= 0) {
      console.log('Tienes que ingresar un número válido, mayor que cero.');
      return [];
    }

    console.log(`\nVamos a evaluar ${cantidad} empleado(s)\n`);

    // Guardar empleados
    const empleados: Empleado[] = [];
    let sumaTotal = 0;
    let empleadosDestacados = 0;
    let mejorEmpleado: Empleado | null = null;
    let peorEmpleado: Empleado | null = null;

    // Pedir datos
    for (let i = 0; i < cantidad; i++) {
      console.log(`--- Empleado ${i + 1} ---`);

      // Pedir cédula
      let cedula = '';
      while (cedula.trim() === '') {
        cedula = await preguntar('Cédula: ');
        if (cedula.trim() === '') {
          console.log('La cédula no puede estar vacía');
        }
      }

      // Verificar si la cédula ya existe
      const cedulaExistente = empleados.find(e => e.cedula === cedula.trim());
      if (cedulaExistente) {
        console.log('Ya existe un empleado con esta cédula. Ingrese una cédula diferente.');
        i--; // Repetir este empleado
        continue;
      }

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

      // Crear empleado
      const nuevoEmpleado: Empleado = {
        cedula: cedula.trim(),
        nombre: nombre.trim(),
        evaluacion: evaluacion
      };

      // Guardar el empleado
      empleados.push(nuevoEmpleado);
      
      // Calcular estadísticas
      sumaTotal += evaluacion;
      
      if (evaluacion > 7) {
        empleadosDestacados++;
      }
      
      // Inicializar mejor y peor empleado
      if (mejorEmpleado === null || evaluacion > mejorEmpleado.evaluacion) {
        mejorEmpleado = nuevoEmpleado;
      }
      
      if (peorEmpleado === null || evaluacion < peorEmpleado.evaluacion) {
        peorEmpleado = nuevoEmpleado;
      }
      
      console.log('');
    }

    // Mostrar resultados
    console.log('\n=== RESULTADOS ===');
    
    // Lista de empleados
    console.log('\nEmpleados evaluados:');
    empleados.forEach((emp, i) => {
      console.log(`  ${i + 1}. ${emp.cedula} - ${emp.nombre} - ${emp.evaluacion}/10`);
    });

    // Estadísticas
    const promedio = sumaTotal / cantidad;
    console.log(`\nEstadísticas:`);
    console.log(`  • Promedio general: ${promedio.toFixed(1)}/10`);
    console.log(`  • Empleados destacados (>7): ${empleadosDestacados}`);
    
    if (mejorEmpleado) {
      console.log(`  • Mejor evaluación: ${mejorEmpleado.nombre} (${mejorEmpleado.evaluacion}/10)`);
    }
    
    if (peorEmpleado) {
      console.log(`  • Peor evaluación: ${peorEmpleado.nombre} (${peorEmpleado.evaluacion}/10)`);
    }

    // Comentario sobre el promedio
    console.log('\nAnálisis:');
    if (promedio >= 8) {
      console.log('  ¡Excelente! El equipo está funcionando muy bien');
    } else if (promedio >= 6) {
      console.log('  Buen desempeño, pero hay espacio para mejorar');
    } else {
      console.log('  Necesitan mejorar como equipo');
    }

    return empleados;

  } catch (error) {
    console.log('Ocurrió un error:', error);
    return [];
  }
}

// Programa principal 
async function main() {
  console.log('Bienvenido al sistema de evaluación\n');
  
  let salir = false;
  let empleadosActuales: Empleado[] = [];
  
  while (!salir) {
    console.log('\n=== MENÚ PRINCIPAL ===');
    console.log('1. Realizar nueva evaluación');
    console.log('2. Rectificar evaluación existente');
    console.log('3. Listar empleados actuales');
    console.log('4. Salir');
    
    const opcion = await preguntar('\nSeleccione una opción: ');
    
    switch (opcion) {
      case '1':
        empleadosActuales = await evaluarEmpleados();
        break;
        
      case '2':
        if (empleadosActuales.length === 0) {
          console.log('\nPrimero debe realizar una evaluación (opción 1)');
        } else {
          await modificarEvaluacion(empleadosActuales);
          
          // Recalcular y mostrar estadísticas actualizadas
          console.log('\n=== ESTADÍSTICAS ACTUALIZADAS ===');
          listarEmpleados(empleadosActuales);
          
          const sumaTotal = empleadosActuales.reduce((sum, emp) => sum + emp.evaluacion, 0);
          const promedio = sumaTotal / empleadosActuales.length;
          const empleadosDestacados = empleadosActuales.filter(emp => emp.evaluacion > 7).length;
          
          if (empleadosActuales.length > 0) {
            const mejorEmpleado = empleadosActuales.reduce((mejor, emp) => 
              emp.evaluacion > mejor.evaluacion ? emp : mejor);
            const peorEmpleado = empleadosActuales.reduce((peor, emp) => 
              emp.evaluacion < peor.evaluacion ? emp : peor);
            
            console.log(`\nPromedio actual: ${promedio.toFixed(1)}/10`);
            console.log(`Empleados destacados: ${empleadosDestacados}`);
            console.log(`Mejor evaluación: ${mejorEmpleado.nombre} (${mejorEmpleado.evaluacion}/10)`);
            console.log(`Peor evaluación: ${peorEmpleado.nombre} (${peorEmpleado.evaluacion}/10)`);
          }
        }
        break;
        
      case '3':
        if (empleadosActuales.length === 0) {
          console.log('\nNo hay empleados evaluados. Use la opción 1 primero.');
        } else {
          listarEmpleados(empleadosActuales);
        }
        break;
        
      case '4':
        salir = true;
        break;
        
      default:
        console.log('Opción no válida');
        break;
    }
  }
  
  console.log('\n¡Gracias por usar el sistema!');
  rl.close();
}

// Iniciar el programa
main();