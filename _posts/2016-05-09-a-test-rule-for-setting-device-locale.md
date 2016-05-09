---
layout: post
title: A test rule for setting device locale
tags: [android, junit, rules]
---

When you run your Android tests (like <em>espresso tests</em>), you may want to be able to force the locale of your device to some specific value at runtime (during test execution). This could be really helpful if you want to test some features of your app against multiple locales.

You can do this by using <em>Junit4 rules</em>.
The rule implementation looks like this:

{% highlight java %}
public class ForceLocaleRule implements TestRule {

    private final Locale mTestLocale;
    private Locale mDeviceLocale;

    public ForceLocaleRule(Locale testLocale) {
        mTestLocale = testLocale;
    }

    @Override
    public Statement apply(Statement base, Description description) {
        return new Statement() {
            public void evaluate() throws Throwable {
                try {
                    if (mTestLocale != null) {
                        mDeviceLocale = Locale.getDefault();
                        setLocale(mTestLocale);
                    }

                    base.evaluate();
                } finally {
                    if (mDeviceLocale != null) {
                        setLocale(mDeviceLocale);
                    }
                }
            }
        };
    }


    public void setLocale(Locale locale) {
        Resources resources = InstrumentationRegistry.getTargetContext().getResources();
        Locale.setDefault(locale);
        Configuration config = resources.getConfiguration();
        config.locale = locale;
        resources.updateConfiguration(config, resources.getDisplayMetrics());
    }
}
{% endhighlight %}

The <em>test locale</em> is passed in as a parameter to the constructor. Before test execution we set the <em>test locale</em>. When test is executed, the previous device's locale will be automatically restored. 

And here's an example of a test where locale il setted to <code>Locale.UK</code> before test execution:

{% highlight java %}
@RunWith(AndroidJUnit4.class)
public class MyActivityTest {

    @ClassRule
    public static final ForceLocaleRule localeTestRule = new ForceLocaleRule(Locale.UK);

    @Rule
    public ActivityTestRule<MyActivity> mMyActivityRule = new ActivityTestRule<>(MyActivity.class);

    private Context mContext;

    @Before
    public void setUp() {
    	// ...
    }

    @Test
    public void testSomeMethod() {
    	// ...
    }
}
{% endhighlight %}