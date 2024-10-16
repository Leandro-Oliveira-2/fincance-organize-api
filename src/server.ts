import 'module-alias/register';
import { env } from './env/index';
import { app } from './app';
import figlet from 'figlet';
import prisma from './common/infra/prisma/index'; // Importação do Prisma

async function startApp() {
  const chalk = (await import('chalk')).default;  // Importação dinâmica
  await prisma.$connect();

  const title = chalk.cyan(figlet.textSync('FinanceOrganizer', { horizontalLayout: 'full' }));
  const info = chalk.yellow(`Service running at port ${env.PORT}.`);

  app.listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => console.log(title, '\n', info));
}

startApp();
