---
layout: post
title: A simple splash screen in Android
tags: [android]
---

Splash screens are not so popular in Android development. But wait: now Google started to put splash screens in its apps???
Take a look at Google Drive app for example. Does it mean that now we have a new standard?

This is not the right post to talk about if splash screen in Android is good or bad. Let's think only about code: implementing a splash screen is easy.

I've seen many splash screen implementations, but some of them have <strong>one common bug</strong>. If I close the app (aka: press back button) when the splah screen is visibile, after a while the main screen of the app appears. <em>WTF??? I've closed you, why are you coming back again?</em>

The trick is very simple. Let's take a look at how a very simple SplashActivity could be:

{% highlight java linenos %}
public class SplashActivity extends Activity {

    private static int SPLASH_TIME_OUT = 2000; // 2 seconds

    private Handler mHandler;

    private Runnable mRunnable = new Runnable() {

        @Override
        public void run() {
            startMainActivity();
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_splash);

        mHandler = new Handler();
    }

    @Override
    protected void onResume() {
        super.onResume();

        mHandler.postDelayed(mRunnable, SPLASH_TIME_OUT);
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();

        removeCallbacks();
    }

    @Override
    protected void onStop() {
        super.onStop();

        removeCallbacks();
    }

    private void removeCallbacks() {
        if (mHandler != null) {
            mHandler.removeCallbacks(mRunnable);
        }
    }

    private void startMainActivity() {
        startActivity(new Intent(this, MainActivity.class));

        finish();
    }
}
{% endhighlight %}

This is very straightforward. The key point here is the `removeCallbacks` method: this is where I'm assuring that MainActivity is not started if the user have pressed back button (explicitly closing the application) or if app has gone in background.

In your AndroidManifest.xml don't forget to declare your activity with the following attributes:

{% highlight xml %}

<activity
    android:name=".SplashActivity"
    android:configChanges="orientation|keyboardHidden"
    android:label="@string/application_name"
    android:noHistory="true" >
    <intent-filter>
        <action android:name="android.intent.action.MAIN"/>
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>

{% endhighlight %}
