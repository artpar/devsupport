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
          line: "    compile 'in.lazypay:sdk2:0.0.0'",
          action: 'append',
          query: '.*dependencies'
        },
        validations: [
          {
            checkType: 'negative',
            query: '.+in.lazypay:sdk2.+'
          },
          {
            checkType: 'positive',
            query: 'apply plugin: \'com.android.application\''
          }
        ]
      },
      {
        name: 'Add key to AndroidManifest.xml',
        fileSelector: '.+main[\\\\/]AndroidManifest.xml',
        fileType: 'xml',
        change: {
          changeType: 'add.line',
          line: '<meta-data android:name="in.sdk.lazypay" android:value="M9OZT7LFHPCK91UDVJC8"/>',
          action: 'prepend',
          query: '</application>'
        },
        validations: {
          checkType: 'negative',
          query: 'in.sdk.lazypay'
        }
      },
      {
        name: 'Add functions to some Activity.java for Initiate Pay and Handle Response',
        fileSelector: '.+Activity.java',
        fileType: 'java',
        change: [
          {
            changeType: 'add.line',
            action: 'append',
            query: '{',
            line: `
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        switch (requestCode) {
            case 1: {
                switch (resultCode) {
                    case Lazypay.LAZYPAY_SUCCESS :
                        Toast.makeText(getApplicationContext(), "Transaction Successful", Toast.LENGTH_LONG)
                                .show();
                        break;
                    case Lazypay.LAZYPAY_FAILED:
                        Toast.makeText(getApplicationContext(), "Transaction Failed", Toast.LENGTH_LONG)
                                .show();
                        break;
                    default:
                        break;
                }
            }
        }
    }`,
            validations: [{
              checkType: 'negative',
              query: 'onActivityResult'
            }],
          },
          {
            changeType: 'add.line',
            action: 'append',
            query: '{',
            line: `
    private void callLazyPay(String email, String mobile, String amount) {
        Intent intent = new Intent(this.getApplicationContext(), Lazypay.class);

        intent.putExtra("email", email);

        intent.putExtra("mobile", mobile);

        intent.putExtra("amount", amount);

        startActivityForResult(intent, 1);
    }`,
            validations: [{
              checkType: 'negative',
              query: 'callLazyPay'
            }],
          },
          {
            changeType: 'add.line',
            action: 'append',
            query: 'import',
            line: `
import lazypay.app.Lazypay;
import android.content.Intent;
`,
            validations: [
              {
                checkType: 'negative',
                query: 'lazypay.app.Lazypay'
              }
            ]
          },
          {
            changeType: 'add.line',
            action: 'append',
            query: 'import',
            line: `
import android.widget.Toast;
`,
            validations: [{
              checkType: 'negative',
              query: 'android.widget.Toast'
            }
            ],
          }
        ],
        validations: []
      }
    ],
  }
}