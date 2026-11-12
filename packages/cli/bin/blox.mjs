#!/usr/bin/env node
import { CliError, run } from "../src/cli.mjs";

run(process.argv.slice(2)).catch((error) => {
  if (error instanceof CliError) {
    process.stderr.write(`\nError: ${error.message}\n`);
    process.exit(1);
  }
  throw error;
});
