import fs from "fs";
import { spawn } from "child_process";
import { tempConfigPath, tempTsConfigTip } from "./constants";
import {
  getTypeCheckTsConfig,
  clearTsCheckIgnoreFileContent,
  isTypeCheckIgnoreFile,
  updateTsCheckIgnoreFileContent,
} from "./utils";
import type { ErrorFileRecord, TypeCheckOptions } from "./types";

export const runIncrementalTypeCheck = (options?: TypeCheckOptions) => {
  const { updateIgnore } = options ?? {};

  fs.writeFileSync(
    tempConfigPath,
    tempTsConfigTip +
      JSON.stringify(getTypeCheckTsConfig({ readArgs: true }), null, 2)
  );

  if (updateIgnore) {
    clearTsCheckIgnoreFileContent();
  }

  // 创建一个子进程
  const child = spawn("npx", ["tsc", "-p", tempConfigPath, "--skipLibCheck"], {
    stdio: "inherit",
    shell: true,
  });

  let resultStr = "";

  // 监听子进程的stdout事件
  child.stdout?.on("data", (data) => {
    const output = Buffer.from(data).toString("utf-8");
    resultStr += output;
  });

  // 监听子进程的 exit 事件
  child.on("exit", async (code) => {
    // 删除校验时的临时tsconfig配置
    fs.rmSync(tempConfigPath);

    // 输出的所有行
    const errorLines = resultStr.split("\n");
    // 保存所有有错误的文件路径以及对应的错误信息
    const errorFilesRecords: ErrorFileRecord[] = [];

    errorLines.forEach((line) => {
      // 表示该行不是单纯的错误信息，而是包含路径的错误文件信息
      if (line && !line.startsWith(" ")) {
        const filePath = line.match(/(.+)(?=\(.+\): error )/)?.[0] ?? "";
        const record = { filePath, error: line };
        errorFilesRecords.push(record);
      } else {
        // 否则错误行添加到对应的错误信息中
        const lastRecord = errorFilesRecords[errorFilesRecords.length - 1];
        if (lastRecord) lastRecord.error = lastRecord.error + "\n" + line;
      }
    });

    // 得到过滤后的有错误的文件路径以及对应的错误信息
    const errorFileFilterRecords = errorFilesRecords.filter(
      ({ filePath }) => filePath && !isTypeCheckIgnoreFile(filePath)
    );

    // 如果除去被ignore错误的文件还存在错误，则退出进程，否则表示校验通过
    if (errorFileFilterRecords.length) {
      if (updateIgnore) {
        updateTsCheckIgnoreFileContent(errorFileFilterRecords);
      }
      console.log(errorFileFilterRecords.map(({ error }) => error).join("\n"));
      process.exit(code ?? 0);
    } else {
      console.log("typeCheck Success!");
    }
  });
};

runIncrementalTypeCheck();
