#!/usr/bin/env node

import { runIncrementalTypeCheck } from "../src/typeCheck";

const main = async () => {
  const args = process.argv.slice(2);
  const updateIgnore = args.includes("--ignore");

  await runIncrementalTypeCheck({
    updateIgnore,
  });
};

main();
