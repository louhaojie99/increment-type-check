import fs from "fs";
import path from "path";
import stripJsonComments from "strip-json-comments";
import { root, rootDir, tsCheckIgnorePath } from "./constants";
import type { ErrorFileRecord } from "./types";

const ignoreContent = fs.readFileSync(path.join(root, ".tsCheckIgnore"));
const ignorePaths = ignoreContent.toString("utf-8").split("\n");
const ignorePathSet = new Set(ignorePaths);

/**
 * 获取ts校验的tsconfig
 * @param options 一些可选选项
 * @returns ts校验的tsconfig
 */
export const getTypeCheckTsConfig = (options?: { readArgs?: boolean }) => {
  const args = process.argv.slice(2);
  const configFilePath = path.join(root, "tsconfig.json");
  const checkingConfigJsonStr = stripJsonComments(
    fs.readFileSync(configFilePath).toString("utf-8")
  );
  const checkingTsConfig = JSON.parse(checkingConfigJsonStr);

  // 更新临时的配置
  checkingTsConfig.compilerOptions.noEmit = true;
  // 对于js文件不进行校验加快校验速度，新增文件都统一使用TS文件
  checkingTsConfig.compilerOptions.allowJs = false;
  checkingTsConfig.compilerOptions.checkJs = false;

  // 当有参数传递进来时则将参数指定进files中进行校验，并且将 include 置空
  if (options?.readArgs && args.length) {
    checkingTsConfig.include = [];
    checkingTsConfig.files = args;
  }

  return checkingTsConfig;
};

/**
 * 判断一个文件是否为ts校验需要跳过的文件
 * @param filePath 文件路径
 * @returns 是否为ts校验需要跳过的文件
 */
export const isTypeCheckIgnoreFile = (filePath: string) => {
  const relativePath = filePath.startsWith(rootDir)
    ? filePath.substring(rootDir.length)
    : filePath;
  return ignorePathSet.has(relativePath);
};

export const clearTsCheckIgnoreFileContent = () => {
  fs.writeFileSync(tsCheckIgnorePath, "", "utf-8");
};

export const updateTsCheckIgnoreFileContent = (
  errorFilesRecords: ErrorFileRecord[]
) => {
  const content = uniq(errorFilesRecords.map(({ filePath }) => filePath)).join(
    "\n"
  );
  fs.writeFileSync(tsCheckIgnorePath, content);
};

export const uniq = <T>(array: ArrayLike<T> | null | undefined): T[] => {
  if (!Array.isArray(array)) return [];
  var result = [...new Set(array)];
  return result;
};
