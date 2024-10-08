import { env } from '@/env';
import { app } from './app';
import chalk from 'chalk';
import figlet from 'figlet';

const title = chalk.cyan(figlet.textSync('FinanceOrganizer', { horizontalLayout: 'full' }));
const info = chalk.yellow(`Service running at port ${env.PORT}.`);

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => console.log(title, '\n', info));