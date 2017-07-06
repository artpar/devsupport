export default {
  "lazyPayAndroid": {
    name: "LazyPay Android Integration",
    changes: [
      {
        name: 'Add dependency to lazypay',
        fileSelector: '.+build.gradle$',
        fileType: 'gradle',
        change: {
          changeType: 'add.line',
          line: "compile 'in.lazypay:sdk2:0.0.0'",
          action: 'append',
          query: '.+com.android.tools.+'
        },
        validate: {
          checkType: 'textSearch',
          query: '.+in.lazypay:sdk2.+'
        }
      },
      {
        name: 'Add key to AndroidManifest.xml',
        fileSelector: '.+main/AndroidManifest.xml',
        fileType: 'xml',
        change: {
          changeType: 'add.line',
          line: '<meta-data android:name="in.sdk.lazypay" android:value="M9OZT7LFHPCK91UDVJC8"/>',
          action: 'prepend',
          query: '</application>'
        },
        validate: {
          checkType: 'textSearch',
          query: 'in.sdk.lazypay'
        }
      },
      {
        name: 'Add function to Main Activity',
        fileSelector: '.+/.+Activity.java',
        fileType: 'java',
        change: {
          changeType: 'add.function',
          functionString: 'public statc void test(){\n\n}',
        },
        validate: [
          {
            validationType: 'check extends',
            validationValue: 'AppCompatActivity'
          },
          {
            validationType: 'name notequal',
            validationValue: 'R.java'
          }
        ]
      }
    ],
  }
}