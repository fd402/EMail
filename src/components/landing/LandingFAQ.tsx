import { Plus } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';

const FAQS = [
    {
        question: "Is there really a free plan?",
        answer: "Yes! You can use Plainly for free forever. You get access to all basic building blocks and can export up to 3 emails per month. No credit card required."
    },
    {
        question: "What happens if I upgrade?",
        answer: "Upgrade to Pro and you'll instantly unlock premium blocks like Video, Countdowns, and Tables. You also get unlimited exports and priority support."
    },
    {
        question: "Can I use my own domain?",
        answer: "Custom domains are available on the Agency plan. This allows you to white-label the editor and share preview links with your own branding."
    },
    {
        question: "Does it work with Mailchimp/Klaviyo?",
        answer: "Absolutely. Plainly generates clean, standard HTML that is tested to work with all major email service providers including Mailchimp, Klaviyo, HubSpot, and more."
    },
    {
        question: "Can I cancel anytime?",
        answer: "Yes, there are no long-term contracts. You can cancel your subscription at any time from your account settings."
    }
];

export const LandingFAQ = () => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
                    <p className="text-slate-500 text-lg">Everything you need to know about Plainly.</p>
                </div>

                <Accordion.Root type="single" collapsible className="space-y-4">
                    {FAQS.map((faq, i) => (
                        <Accordion.Item
                            key={i}
                            value={`item-${i}`}
                            className="group bg-slate-50 border border-slate-100 rounded-2xl px-6 data-[state=open]:bg-white data-[state=open]:shadow-lg data-[state=open]:border-indigo-100 transition-all duration-300"
                        >
                            <Accordion.Trigger className="w-full py-6 flex items-center justify-between text-left">
                                <span className="font-bold text-slate-900 text-lg group-data-[state=open]:text-indigo-600 transition-colors">
                                    {faq.question}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-data-[state=open]:bg-indigo-600 group-data-[state=open]:border-indigo-600 group-data-[state=open]:text-white transition-all duration-300">
                                    <Plus className="w-4 h-4 transition-transform duration-300 group-data-[state=open]:rotate-45" />
                                </div>
                            </Accordion.Trigger>
                            <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                                <div className="pb-6 text-slate-500 font-medium leading-relaxed">
                                    {faq.answer}
                                </div>
                            </Accordion.Content>
                        </Accordion.Item>
                    ))}
                </Accordion.Root>
            </div>
        </section>
    );
};
