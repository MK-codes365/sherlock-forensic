
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Bot, Loader2, Mic, Search } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  query: z.string().min(1, {
    message: 'Query cannot be empty.',
  }),
  caseData: z.string().min(1, {
    message: 'Case data cannot be empty. Please upload a UFDR file first.',
  }),
});

type QueryFormValues = z.infer<typeof formSchema>;

interface QueryFormProps {
  onSubmit: (query: string, caseData: string) => void;
  isLoading: boolean;
  caseData: string;
}

const mockData = `
- Chat Record (WhatsApp): "Met with John at the usual spot. He has the crypto wallet details. Address is bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh." at 2024-07-15 10:30
- File Record (Device Storage): "contact_list.csv" at 2024-07-14 18:00
- Call Log (Phone Records): "Incoming call from +44 20 7946 0958 (2m 15s)" at 2024-07-15 11:05
- Chat Record (Telegram): "Received payment to 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa. Send the package." at 2024-07-16 09:00
`;

const querySuggestions = [
    'Find all cryptocurrency addresses.',
    'List all calls made to foreign numbers.',
    'Summarize chats that mention "payment".',
    'Show me all image files.',
];

export function QueryForm({ onSubmit, isLoading, caseData }: QueryFormProps) {
  const form = useForm<QueryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
      caseData: caseData || '',
    },
  });

   const { toast } = useToast();
   const [isListening, setIsListening] = useState(false);
   const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          form.setValue('query', transcript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          toast({
            variant: 'destructive',
            title: 'Voice Recognition Error',
            description: `An error occurred: ${event.error}. Please try again.`,
          });
          setIsListening(false);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
         toast({
            variant: 'destructive',
            title: 'Browser Not Supported',
            description: 'Your browser does not support voice recognition.',
        });
      }
    }
  }, [form, toast]);

   const handleMicClick = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };


  useEffect(() => {
    form.setValue('caseData', caseData);
  }, [caseData, form]);

  function handleFormSubmit(values: QueryFormValues) {
    onSubmit(values.query, values.caseData);
  }

  return (
    <Card className="glowing-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot /> AI-Powered Investigation
        </CardTitle>
        <CardDescription>
          Use natural language to search through case data. The AI will
          highlight key findings, generate a summary, and suggest related
          evidence.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="caseData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Data Context</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Upload a UFDR file from the 'New Case / UFDR Upload' tab to populate this field."
                      className="min-h-[200px] font-mono text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the raw data the AI will analyze. It is populated from the uploaded UFDR file.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Query</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="e.g., 'Show me all conversations about finances'"
                        className="pl-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8",
                            isListening && "bg-destructive/20 text-destructive"
                        )}
                        onClick={handleMicClick}
                      >
                        <Mic className="h-5 w-5" />
                        <span className="sr-only">Use voice</span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
                <p className="text-sm text-muted-foreground mb-2">Or try one of these suggestions:</p>
                <div className="flex flex-wrap gap-2">
                    {querySuggestions.map((suggestion) => (
                        <Button
                            key={suggestion}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => form.setValue('query', suggestion)}
                            className="text-xs"
                        >
                            {suggestion}
                        </Button>
                    ))}
                </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Run AI Analysis'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
