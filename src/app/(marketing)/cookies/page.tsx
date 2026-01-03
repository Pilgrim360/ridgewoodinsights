
import { Container, Section, Heading } from '@/components/ui';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
};

export default function CookiePolicyPage() {
  return (
    <Section className="py-20 lg:py-28">
      <Container>
        <Heading as={1} className="mb-12 text-center">
          Cookie Policy
        </Heading>

        <div className="prose prose-lg mx-auto max-w-4xl">
          <p>
            This is the Cookie Policy for Ridgewood Insights, accessible from ridgewoodinsights.com. To make this site
            work properly, we sometimes place small data files called cookies on your device. Most big websites do this
            too.
          </p>

          <Heading as={2}>1. What Are Cookies</Heading>
          <p>
            As is common practice with almost all professional websites, this site uses cookies, which are tiny files
            that are downloaded to your computer, to improve your experience. This page describes what information they
            gather, how we use it and why we sometimes need to store these cookies. We will also share how you can
            prevent these cookies from being stored however this may downgrade or &apos;break&apos; certain elements of the sites
            functionality.
          </p>

          <Heading as={2}>2. How We Use Cookies</Heading>
          <p>
            We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry
            standard options for disabling cookies without completely disabling the functionality and features they add
            to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or
            not in case they are used to provide a service that you use.
          </p>

          <Heading as={2}>3. Disabling Cookies</Heading>
          <p>
            You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for
            how to do this). Be aware that disabling cookies will affect the functionality of this and many other
            websites that you visit. Disabling cookies will usually result in also disabling certain functionality and
            features of this site. Therefore it is recommended that you do not disable cookies.
          </p>

          <Heading as={2}>4. The Cookies We Set</Heading>
          <ul>
            <li>
              <strong>Site preferences cookies:</strong> In order to provide you with a great experience on this site
              we provide the functionality to set your preferences for how this site runs when you use it. In order to
              remember your preferences we need to set cookies so that this information can be called whenever you
              interact with a page is affected by your preferences.
            </li>
          </ul>

          <Heading as={2}>5. Third Party Cookies</Heading>
          <p>
            In some special cases we also use cookies provided by trusted third parties. The following section details
            which third party cookies you might encounter through this site. This site uses Google Analytics which is
            one of the most widespread and trusted analytics solution on the web for helping us to understand how you
            use the site and ways that we can improve your experience.
          </p>

          <Heading as={2}>6. More Information</Heading>
          <p>
            Hopefully that has clarified things for you. If you are still looking for more information then you can
            contact us through one of our preferred contact methods.
          </p>
        </div>
      </Container>
    </Section>
  );
}
