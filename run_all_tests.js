import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runTest(testFile, description) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🧪 EJECUTANDO: ${description}`);
    console.log(`${'='.repeat(60)}`);
    
    try {
        const { stdout, stderr } = await execAsync(`node ${testFile}`);
        
        if (stdout) {
            console.log(stdout);
        }
        
        if (stderr) {
            console.log('⚠️  Warnings:', stderr);
        }
        
        console.log(`✅ ${description} completado exitosamente`);
        return true;
        
    } catch (error) {
        console.log(`❌ Error ejecutando ${description}:`);
        console.log(error.stdout || error.message);
        return false;
    }
}

async function runAllTests() {
    console.log('🚀 INICIANDO SUITE COMPLETA DE PRUEBAS DE SEGURIDAD');
    console.log('Fecha:', new Date().toLocaleString());
    
    const tests = [
        { file: 'test_api.js', description: 'Pruebas básicas de API' },
        { file: 'test_security.js', description: 'Pruebas de seguridad y aislamiento de usuarios' },
        { file: 'test_edge_cases.js', description: 'Pruebas de casos edge y situaciones complejas' },
        { file: 'test_data_integrity.js', description: 'Pruebas de integridad de datos' }
    ];
    
    const results = [];
    
    for (const test of tests) {
        const success = await runTest(test.file, test.description);
        results.push({ ...test, success });
        
        // Pausa entre pruebas para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Resumen final
    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 RESUMEN FINAL DE PRUEBAS');
    console.log(`${'='.repeat(60)}`);
    
    const exitosas = results.filter(r => r.success).length;
    const total = results.length;
    
    console.log(`✅ Pruebas exitosas: ${exitosas}/${total}`);
    console.log(`❌ Pruebas fallidas: ${total - exitosas}/${total}`);
    
    results.forEach(result => {
        const status = result.success ? '✅' : '❌';
        console.log(`${status} ${result.description}`);
    });
    
    if (exitosas === total) {
        console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!');
        console.log('🔒 El sistema de autenticación y seguridad está funcionando correctamente.');
    } else {
        console.log('\n⚠️  ALGUNAS PRUEBAS FALLARON');
        console.log('🔍 Revisa los errores anteriores para identificar problemas de seguridad.');
    }
    
    console.log(`\n⏰ Finalizado: ${new Date().toLocaleString()}`);
}

// Verificar que el servidor esté corriendo antes de ejecutar las pruebas
async function checkServer() {
    try {
        const { stdout } = await execAsync('curl -s http://localhost:3000/api/usuarios/ranking');
        return true;
    } catch (error) {
        return false;
    }
}

async function main() {
    console.log('🔍 Verificando que el servidor esté corriendo...');
    
    const serverRunning = await checkServer();
    
    if (!serverRunning) {
        console.log('❌ Error: El servidor no está corriendo en http://localhost:3000');
        console.log('💡 Asegúrate de iniciar el servidor con: npm start');
        process.exit(1);
    }
    
    console.log('✅ Servidor detectado, iniciando pruebas...\n');
    
    await runAllTests();
}

main().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
}); 