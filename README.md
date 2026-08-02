# 地域求人倍率

全国・47労働局の職業計の有効求人倍率を、2023〜2025年度、3つの常用雇用区分から選び、求人・求職の元件数とともに最大4地域で比較する日本語Webサービスです。

- Production: <https://chiiki-bairitsu.yhay81.com>
- Source: 厚生労働省「一般職業紹介状況（職業安定業務統計）雇用関係指標（年度）」第4表・第5表
- Runtime: Cloudflare Workers + Hono JSX + Vite+ + D1
- Account: 不要

## Commands

```powershell
npm install
npm run data:check
npm run check
npm test
npm run build
npm run dev
```

公開前は`npm run release:check`を実行します。D1 migrationを適用してから`npm run deploy`で配信します。

## Data boundary

倍率は同じ労働局・年度・常用雇用区分の「月間有効求人数 ÷ 月間有効求職者数」です。年度値は月間件数の合計なので、同じ未充足求人・就職未決定者が複数月に含まれ得ます。求人票数、採用確率、仕事の質、地域順位ではありません。

コードはMIT Licenseです。データの利用条件は[SOURCE.md](SOURCE.md)を参照してください。
