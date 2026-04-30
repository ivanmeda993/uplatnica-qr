import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FAQ } from '@/lib/landing/faq-data';

export function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="mx-auto max-w-3xl scroll-mt-24 px-5 py-20"
    >
      <div className="mb-10 max-w-2xl">
        <p className="text-brand mb-3 text-xs font-semibold tracking-wider uppercase">
          Često pitanja
        </p>
        <h2
          id="faq-heading"
          className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
        >
          Sve što treba da znaš pre nego što počneš.
        </h2>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {FAQ.map((item, i) => (
          <AccordionItem key={item.q} value={`item-${i}`}>
            <AccordionTrigger className="text-left text-base font-semibold">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
