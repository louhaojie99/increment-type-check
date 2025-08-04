import path from "path";

export const root = process.cwd();

export const rootDir = root + path.sep;

export const tempConfigPath = path.join(root, "tsCheckConfig.json");

/**
 * 生成校验时的临时tsconfig配置，（为什么需要生成临时配置文件来校验，主要是为了支持能在lint-staged中对部分文件进行校验）
 * 但是目前tsc不支持-p 与 指定文件同时指定，有关方案仍在讨论中：https://github.com/microsoft/TypeScript/issues/27379
 */
export const tempTsConfigTip = `// 该文件为增TS校验生成的临时配置文件，请勿修改 \n`;

export const tsCheckIgnorePath = path.join(root, ".tsCheckIgnore");

/**
 * 当许多存量文件已经修复了 TypeScript 问题，但这些文件仍然被记录在 .tsCheckIgnore 文件中时，
 * 可以启用此配置项，并触发对 .tsCheckIgnore 文件内容的更新。
 */
export const isUpdateTsCheckIgnore = false;
