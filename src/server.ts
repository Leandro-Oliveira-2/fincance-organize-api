import 'module-alias/register';
import { env } from './env/index';
import { app } from './app';

async function startApp() {
  const chalk = (await import('chalk')).default;  // Importação dinâmica

  const title = chalk.cyan('FinanceOrganizer');
  const info = chalk.yellow(`Service running at port ${env.PORT}.`);

  app.listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => console.log(title, '\n', info));
}

startApp();