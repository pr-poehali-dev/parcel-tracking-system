import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="text-muted-foreground">
                Aboba Express collects information necessary to provide shipping services, including sender and recipient details,
                package dimensions, weight, and tracking information. We collect this data to ensure accurate delivery and tracking
                of your shipments.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-2">
                The information we collect is used for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Processing and delivering your packages</li>
                <li>Providing tracking updates and notifications</li>
                <li>Communicating with you about your shipments</li>
                <li>Improving our shipping services and customer experience</li>
                <li>Complying with legal and regulatory requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your personal information. All data transmitted
                through our systems is encrypted, and access to customer information is restricted to authorized personnel only.
                Our data centers maintain high security standards with 24/7 monitoring.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Information Sharing</h2>
              <p className="text-muted-foreground">
                We do not sell your personal information to third parties. Information may be shared with delivery partners
                and customs authorities as necessary to complete shipments. We may also share information when required by law
                or to protect our rights and the safety of our customers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
              <p className="text-muted-foreground mb-2">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Access your personal data we hold</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your data (subject to legal requirements)</li>
                <li>Opt-out of marketing communications</li>
                <li>Lodge a complaint with data protection authorities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Cookies and Tracking</h2>
              <p className="text-muted-foreground">
                Our website uses cookies to enhance user experience and provide tracking functionality. You can control
                cookie preferences through your browser settings. Essential cookies are necessary for the website to function
                properly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. International Transfers</h2>
              <p className="text-muted-foreground">
                As a global shipping company headquartered in Guangzhou, China, your information may be transferred and
                processed in different countries. We ensure appropriate safeguards are in place for international data transfers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
              <p className="text-muted-foreground">
                For privacy-related inquiries or to exercise your rights, please contact us at:
              </p>
              <div className="mt-3 p-4 bg-muted rounded-lg">
                <p className="font-semibold">Aboba Express Privacy Team</p>
                <p className="text-sm text-muted-foreground">Headquarters: Guangzhou, China</p>
                <p className="text-sm text-muted-foreground">Email: privacy@abobaexpress.com</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
