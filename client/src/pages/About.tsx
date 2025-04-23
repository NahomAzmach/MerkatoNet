import { useTranslation } from "react-i18next";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { MessageSquare } from "lucide-react";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            About MerkatoNet
          </h1>
          <p className="text-lg max-w-2xl mx-auto">
            Connecting Ethiopian farmers directly with buyers to improve market access and ensure fair prices
          </p>
        </div>
      </section>
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl font-bold text-neutral-dark mb-6">
                Our Mission
              </h2>
              <p className="text-neutral-dark/80 mb-4">
                MerkatoNet was created to solve a critical problem in Ethiopia's agricultural economy: the disconnect between small-scale farmers and potential buyers.
              </p>
              <p className="text-neutral-dark/80 mb-4">
                By providing a direct connection between farmers and buyers, we eliminate unnecessary middlemen, allowing farmers to receive fair prices for their produce while giving buyers access to fresher, more affordable goods.
              </p>
              <p className="text-neutral-dark/80">
                Our platform focuses on transparency, accessibility, and building a stronger agricultural community.
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1596638787647-904d822d751e" 
                alt="Ethiopian farmers in a field" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-neutral-dark mb-4">
              How We Help
            </h2>
            <p className="text-neutral-dark/80 max-w-2xl mx-auto">
              MerkatoNet addresses several key challenges in the Ethiopian agricultural market
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-primary">
                  Market Price Transparency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-dark/80">
                  We provide real-time market price information from Addis Ababa and other major markets, helping farmers make informed decisions about when and where to sell their produce.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-primary">
                  Direct Market Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-dark/80">
                  Our platform allows farmers to list their products directly, eliminating middlemen and increasing profit margins while allowing buyers to access fresher products at better prices.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-primary">
                  SMS Notification System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-dark/80">
                  With limited internet access in rural areas, our SMS service delivers critical market information, alerts, and updates to farmers wherever they are.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-neutral-dark mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I register as a farmer?</AccordionTrigger>
                <AccordionContent>
                  Registration is simple. Click on the "Register" button in the top navigation, fill out your details, and select "Farmer" as your account type. You'll need to provide a valid phone number for verification.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>How can I list my products for sale?</AccordionTrigger>
                <AccordionContent>
                  After registering and logging in as a farmer, navigate to your profile page and click on "My Products". From there, you can add new products with details like type, quality, quantity, price, and location.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>Is there a fee to use MerkatoNet?</AccordionTrigger>
                <AccordionContent>
                  Basic usage of MerkatoNet is free for both farmers and buyers. We aim to keep the platform accessible to all. In the future, we may introduce premium features for enhanced visibility and marketing.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>How do SMS alerts work?</AccordionTrigger>
                <AccordionContent>
                  You can subscribe to SMS alerts by providing your phone number in your profile settings or through our subscription form. You'll receive daily updates on teff prices in Addis Ababa or other markets you're interested in.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>How do I contact a seller?</AccordionTrigger>
                <AccordionContent>
                  When you find a product you're interested in, click the "Contact" button on the product card. This will initiate a request to the seller, who will then be able to contact you directly to discuss the transaction.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold mb-6">
            Contact Us
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center">
              <MessageSquare className="h-6 w-6 mr-2" />
              <span>info@merkatonet.et</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-6 w-6 mr-2" />
              <span>+251 91 234 5678</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-6 w-6 mr-2" />
              <span>SMS "HELP" to 2288</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
