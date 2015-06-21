---
layout: post
title: Access Storage Framework and the URI permissions nightmare
tags: [android]
comments: true
image:
  feature: android1.png
---

I've been working with the <strong>Access Storage Framework</strong> introduced with Android KitKat, a feature that I've been waiting for a long time.

Everything seemed to be alright, quite easy to implement, until I faced a strange issue.

Once the file has been selected by the user, I wanted to store the file's URI and re-open that URI the next time application is started. To do this, I've followed what the [official documentation](https://developer.android.com/guide/topics/providers/document-provider.html) says:

> When your app opens a file for reading or writing, the system gives your app a URI permission grant for that file. It lasts until the user's device restarts. But suppose your app is an image-editing app, and you want users to be able to access the last 5 images they edited, directly from your app. If the user's device has restarted, you'd have to send the user back to the system picker to find the files, which is obviously not ideal.

> To prevent this from happening, you can persist the permissions the system gives your app. Effectively, your app "takes" the persistable URI permission grant that the system is offering. This gives the user continued access to the files through your app, even if the device has been restarted:

{% highlight java %}
final int takeFlags = intent.getFlags()
            & (Intent.FLAG_GRANT_READ_URI_PERMISSION
            | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
// Check for the freshest data.
getContentResolver().takePersistableUriPermission(uri, takeFlags);
{% endhighlight %}

It didn't work. <em>Doh!</em>

I was getting a `java.lang.SecurityException` while trying to open the URI using `getContentResolver().openInputStream(uri)` or `getContentResolver().openAssetFileDescriptor(uri, "r")`:

{% highlight java %}
java.lang.SecurityException: Permission Denial: opening provider com.android.providers.media.MediaDocumentsProvider from ProcessRecord{430b1748 4572:com.x.x.7/u0a88} (pid=4572, uid=10078) requires android.permission.MANAGE_DOCUMENTS or android.permission.MANAGE_DOCUMENTS
{% endhighlight %}

Adding `android.permission.MANAGE_DOCUMENTS` to AndroidManifest.xml didn't helped, and the many solutions found on <em>stackoverflow.com</em> didn't work.

After taking a deeper look at the APIs and the source code I've found a working way to grant URI permissions:

{% highlight java %}
activity.grantUriPermission(activity.getPackageName(), uri, Intent.FLAG_GRANT_READ_URI_PERMISSION);
{% endhighlight %}

place this call before `getContentResolver().takePersistableUriPermission(uri, takeFlags)` and read permissions will be granted! Yeah!

The resulting code will be:

{% highlight java %}
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
  if (requestCode == MY_REQUEST_CODE && resultCode == Activity.RESULT_OK) {
    if (data != null) {

      Uri uri = data.getData();

      mActivity.grantUriPermission(mActivity.getPackageName(), uri, Intent.FLAG_GRANT_READ_URI_PERMISSION);

      final int takeFlags = data.getFlags() & (Intent.FLAG_GRANT_READ_URI_PERMISSION);
      mActivity.getContentResolver().takePersistableUriPermission(uri, takeFlags);

      doSomethingWith(uri);
    }
  }
}
{% endhighlight %}
