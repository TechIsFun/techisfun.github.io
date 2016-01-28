---
layout: post
title: Android - Enable app features at compile time
tags: [android, gradle]
---

Somtimes some fetaures of your app must behave differently for different flavors o build type.
Think about when you need to enable logging for a specific flavor only, or you have to disable crash reporting for your "dev build". All this behaviours can be configured at compile time, insted of using many <em>if/else blocks</em> that are evaluated at runtime.

<em>In the following example I'll use Gradle and Dagger.</em>

### Use case: enable crash reporting only for production flavor.

First step: create an interface <code>CrashReporter</code> and two implementations: <code>CrashReporterRealImpl</code> and <code>CrashReporterNullImpl</code>.

{% highlight java %}
// the interface
public interface CrashReporter {
  
  void init(Application application);

  void logException(Exception e);
}

// this implementation will report crashes
public class CrashReporterRealImpl implements CrashReporter {
  
  public void init(Application application) {
    Fabric.with(application, new Crashlytics()); 
  }

  public void logException(Throwable t) {
    Crashlytics.logException(t);
  }
}

// this implementation will do nothing
public class CrashReporterNullImpl implements CrashReporter {
  
  public void init(Application application) {
    // do nothing
  }

  public void logException(Throwable t) {
    // do nothing
  }
}
{% endhighlight %}

Second step: configure the <code>build.gradle</code> file for our app.

	{% raw %}
	android {
	  // constants
	  def BOOLEAN = "boolean"
	  def TRUE = "true"
	  def FALSE = "false"

	  // app features
	  def FEATURE_CRASH_REPORTING_ENABLED = "FEATURE_CRASH_REPORTING_ENABLED"
	  ...

	  defaultConfig {
	      ...

	      // default features
	      buildConfigField BOOLEAN, FEATURE_CRASH_REPORTING_ENABLED, FALSE
	      
	  }

	  productFlavors {
	      developer {
	        ...
	      }
	      qateam {
	        ...
	      }
	      playstore {
	        ...
	        buildConfigField BOOLEAN, FEATURE_CRASH_REPORTING_ENABLED, TRUE
	        
	      }
	  }   
	}
	{% endraw %}

Third step: use dagger to provide the right instance of <code>CrashReporter</code>.

{% highlight java %}
@Module
public class ApplicationModule {

  @Provides
  @Singleton
  CrashReporter provideCrashReporter() {
    if (BuildConfig.FEATURE_CRASH_REPORTING_ENABLED) {
          return new CrashReporterRealImpl();
      } else {
          return new CrashReporterNullImpl();
      }
  }
}
{% endhighlight %}

Final step: inject and use!

{% highlight java %}
public class MyApp extends Application {

  @Inject
  CrashReporter mCrashReporter;

  @Override
  public void onCreate() {
    super.onCreate();

    component = DaggerMyApp_ApplicationComponent.builder()
            .applicationModule(new ApplicationModule(this))
            .build();

    component.inject(this);

    mCrashReporter.init(this);
  }
}
{% endhighlight %}

It could seem a lot of code for just enabling/disabling a feature, but with this approach the **code is modular** (for example you could easily replace CrashReporterRealImpl with another one that uses another service, or you can temporarly enable crash reporting for another flavor for testing purposes) and **there's no logic that needs to be tested**.

With this approach you could also **develop new functions directly in the master branch** without using a "feature branch".

### Use case: develop a new feture in master branch.

Suppose that we have to work on our new feature called "Experimental Feature". We just need to create an interface and two implementations as done before:


{% highlight java %}
// the interface
public interface ExperimentalFeatureController {
  
  void doSomething(Context context);

}

// this implementation will do the real work
public class ExperimentalFeatureControllerRealImpl implements ExperimentalFeatureController {
  
  public void doSomething(Context context) {
    // implementation logic here!
  }

}

// this implementation will do nothing
public class ExperimentalFeatureControllerNullImpl implements ExperimentalFeatureController {
  
  public void doSomething(Context context) {
    // do nothing
  }

}
{% endhighlight %}

Then create the definitions in build.gradle and add provide method to the dagger module:

{% highlight java %}
@Module
public class ApplicationModule {

  @Provides
  @Singleton
  ExperimentalFeatureController provideExperimentalFeatureController() {
    if (BuildConfig.FEATURE_EXPERIMENTAL_ENABLED) {
          return new ExperimentalFeatureControllerRealImpl();
      } else {
          return new ExperimentalFeatureControllerNullImpl();
      }
  }
}
{% endhighlight %}

Now we can continue to develop in the master branch and commit even when our <code>ExperimentalFeatureControllerRealImpl</code> does not work correctly: FEATURE_EXPERIMENTAL_ENABLED will be TRUE only for our "dev build", and in FALSE for production build.

When <code>ExperimentalFeatureControllerRealImpl</code> will be ready for production, we will just have to set FEATURE_EXPERIMENTAL_ENABLED to TRUE also for production build!