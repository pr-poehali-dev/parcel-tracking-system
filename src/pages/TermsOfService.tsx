import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function TermsOfService() {
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
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Agreement to Terms</h2>
              <p className="text-muted-foreground">
                By using Aboba Express services, you agree to these Terms of Service. If you disagree with any part of these
                terms, you may not access our services. Aboba Express is operated by Aboba Logistics International Ltd.,
                headquartered in Guangzhou, China.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Services Provided</h2>
              <p className="text-muted-foreground">
                Aboba Express provides international shipping and package tracking services. We offer door-to-door delivery
                across 200+ countries with real-time tracking capabilities. Service availability and delivery times may vary
                based on destination and customs processing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Shipping Restrictions</h2>
              <p className="text-muted-foreground mb-2">
                The following items are prohibited from shipment:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Hazardous materials and explosives</li>
                <li>Illegal drugs and narcotics</li>
                <li>Weapons and ammunition</li>
                <li>Perishable food items (except with special packaging)</li>
                <li>Live animals</li>
                <li>Items prohibited by international shipping regulations</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Customers are responsible for ensuring shipments comply with all applicable laws and regulations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Pricing and Payment</h2>
              <p className="text-muted-foreground">
                Shipping rates are calculated based on package weight, dimensions, destination, and selected service level.
                All prices are quoted in USD unless otherwise specified. Payment must be made in full before shipment.
                Additional customs duties and taxes may apply and are the responsibility of the recipient.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Liability and Insurance</h2>
              <p className="text-muted-foreground">
                Aboba Express liability is limited to the declared value of the shipment, up to a maximum of $1,000 USD
                per package unless additional insurance is purchased. We are not liable for delays caused by customs,
                natural disasters, or circumstances beyond our control. Full insurance coverage is available for high-value items.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Delivery and Delays</h2>
              <p className="text-muted-foreground">
                Estimated delivery times are provided in good faith but are not guaranteed. Delays may occur due to customs
                inspections, weather conditions, or operational issues. Aboba Express will make reasonable efforts to deliver
                packages within estimated timeframes. Customers will be notified of significant delays.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Claims and Disputes</h2>
              <p className="text-muted-foreground">
                Claims for lost or damaged packages must be filed within 30 days of the scheduled delivery date. All claims
                require proof of value and packaging condition. Disputes are subject to resolution under Chinese law, with
                jurisdiction in Guangzhou courts. Mediation services are available for international customers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Customer Responsibilities</h2>
              <p className="text-muted-foreground mb-2">
                Customers must:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Provide accurate sender and recipient information</li>
                <li>Package items securely to prevent damage</li>
                <li>Declare package contents accurately and honestly</li>
                <li>Ensure items comply with shipping restrictions</li>
                <li>Pay all applicable fees and customs duties</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Tracking and Privacy</h2>
              <p className="text-muted-foreground">
                Tracking codes are provided for all shipments. Customers can track packages in real-time through our website.
                We collect tracking data to improve service quality. For details on data handling, please see our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Changes to Terms</h2>
              <p className="text-muted-foreground">
                Aboba Express reserves the right to modify these Terms of Service at any time. Changes become effective
                immediately upon posting. Continued use of our services after changes constitutes acceptance of new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these terms or our services:
              </p>
              <div className="mt-3 p-4 bg-muted rounded-lg">
                <p className="font-semibold">Aboba Express Customer Service</p>
                <p className="text-sm text-muted-foreground">Headquarters: Guangzhou, Guangdong Province, China</p>
                <p className="text-sm text-muted-foreground">Email: support@abobaexpress.com</p>
                <p className="text-sm text-muted-foreground">Phone: +86 20 1234 5678</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
