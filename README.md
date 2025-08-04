# TS 增量检查工具

用于 TS 项目的增量检查工具，可以帮助你管理存量错误并专注于新代码的质量。

## 功能特性

- ✅ **增量检查**: 只检查新增变更，专注新代码质量
- 🚫 **忽略管理**: 可配置忽略文件，解决存量错误
- 🔄 **自动更新**: 可自动将存量错误添加到忽略列表
- 📊 **详细报告**: 提供详细的错误统计和报告

## 安装

```bash
npm install --save-dev increment-type-check
```

## 集成到项目

在你的项目 `package.json` 中添加：

```json
{
  "scripts": {
    "typecheck": "typecheck",
    "typecheck:update": "typecheck --ignore"
  }
}
```

## 输出示例

```
src/Test.tsx:1:7 - error TS2322: Type 'number' is not assignable to type 'string'.

1 const str: string = 100;

...
```

这个工具可以帮助你：

- 在大型项目中逐步改善 TS 代码质量
- 在 CI/CD 中集成 TS 检查
