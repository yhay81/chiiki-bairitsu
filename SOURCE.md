# Source and transformation

## Official sources

- Provider: 厚生労働省
- Statistics page: <https://www.mhlw.go.jp/toukei/list/114-1d.html>
- Item 4, active job openings by occupation: <https://www.mhlw.go.jp/toukei/list/xls/114-1d-04.xlsx>
- Item 5, active job seekers by occupation: <https://www.mhlw.go.jp/toukei/list/xls/114-1d-05.xlsx>
- Definitions: <https://www.mhlw.go.jp/toukei/list/114-1_yougo.html>
- Edition: 2023〜2025年度（現行職業分類）
- Source verification: 2026-08-02
- Openings workbook: 1,001,209 bytes; SHA-256 `4c740910e86217951ea7ccfe9f0ed32ff53b3f088c3c97e2328fd13c5d5070ce`
- Job-seekers workbook: 24,574,237 bytes; SHA-256 `0f2ce1388a319c36771e7e9115ab4562bf6d12d63f4289b0bc52a199c1381d55`
- Terms: 公共データ利用規約（第1.0版）
- Terms page: <https://www.mhlw.go.jp/chosakuken/index.html>

出典：厚生労働省「一般職業紹介状況（職業安定業務統計）雇用関係指標（年度）」第4表・第5表を加工して作成。

## Verified dimensions

- 全国と47労働局、48地域
- 2023〜2025年度、3年度
- パートを含む常用、パートを除く常用、常用的パートタイム、3区分
- 職業計の求人と求職を対応づけた432組、864元値
- 欠測0、分母0は0
- `パートを含む常用 = パートを除く常用 + 常用的パート`を求人・求職288系列で検算し、不一致0
- 全国計と47労働局合計を求人・求職18系列で検算し、不一致0
- 2025年度全国・パートを含む常用は24,988,674求人、22,698,922求職、1.10倍

## Transformation / 加工

1. 第4表・第5表の現行職業分類シートから「職業計」の2023〜2025年度を読み取る。
2. 地域、年度、雇用区分が一致する求人と求職だけを対応づける。
3. 雇用区分の合計関係、全国計と47労働局合計、整数、欠測、分母0を検算する。
4. 労働局名を都道府県名へ短縮し、9地域と全国に分類する。
5. 加工前の整数値を静的JSONへ保存し、求人倍率は画面表示時に算出する。
6. 表示とコピーは小数第2位とし、2つの元件数を常に併記する。

公式Excelのハッシュが変わった場合は、更新内容を人が確認してから再生成します。分類が異なる2022年度以前へ接続しません。

## Interpretation boundary

月間有効求人数は前月から繰り越した未充足の求人数と当月の新規求人数、月間有効求職者数は前月から繰り越した就職未決定者と当月の新規求職申込みの合計です。年度値は12か月の合計なので、固有の求人票数・求職者数ではありません。民間求人、応募数、採用数、賃金、待遇、定着、仕事の質、地域の優劣は示しません。
