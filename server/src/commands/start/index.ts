import type {Command} from 'commander';

import {applyAnyAsyncAction} from '../../lib/async_command';

export default function (program: Command) {
  applyAnyAsyncAction(
    program
      .command('start')
      .description('Start the DocumentationServer')
      .alias('s'),
    () => import('./startAsync')
  );
}
