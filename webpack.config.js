const path = require('path')

module.exports = {
  entry: './src/index.tsx', // 最初に読む込むファイルを指定。ここで指定されたファイルの中からファイルを読み込む処理が書かれているとwebpackはそれらのファイルも自動的に読み込んで、最終的に1つのファイルとして出力
  module: {
    rules: [
      {
        test: /\.tsx?$/, // .tsx$で.tsとxは任意で終わるファイルに対してts-loaderを実行する
        use: 'ts-loader',
        exclude: /node_modules/, // 除外するファイルを正規表現で指定
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'], // モジュールとして解決するファイルの拡張子を指定
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // モジュール化したファイルをまとめて任意の名前で吐き出す
    filename: 'index.js', // モジュール化して１ファイルにまとめた時の名前
    publicPath: 'dist/', // まとめたファイルのパス
  },
  devServer: {
    publicPath: '/dist/', // ビルドしたファイルにアクセスするためのパス
    hot: true, // ファイルを変更すると自動的にブラウザに反映させるフラグ
    open: true, // 起動時にブラウザで開くフラグ
  }
}
