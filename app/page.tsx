"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spotlight } from "@/components/ui/spotlight";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      setIsSubmitting(true);
      await axios.post("/api/newsletter", data);
      await axios.post("/api/confirmation", { email: data.email });
      toast.success("Successfully subscribed to the newsletter!");
      form.reset();
    } catch (error: any) {
      const message =
        error.response?.data?.error || "Failed to subscribe. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="h-screen w-full bg-black text-white overflow-hidden relative">
      <Spotlight />
      <div className="container mx-auto px-4 max-w-6xl z-10 relative h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left side - Content */}
          <div className="flex flex-col justify-center space-y-10 text-left px-2 py-8 lg:py-0">
            <h1 className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-normal ">
              The <span className="font-dm-serif font-normal italic mr-1.5" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>Newsletter</span> for the tech early adopters
            </h1>

            <p className="text-base md:text-lg -mt-6 lg:text-xl text-gray-300 max-w-2xl">
              Discover the most successful Product Hunt launches delivered to your
              inbox daily
            </p>

            <div className="w-full max-w-md">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                              placeholder="Your Email Address"
                              className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                              {...field}
                            />
                            <Button
                              type="submit"
                              className="h-12 px-6 bg-white text-black hover:bg-gray-200 whitespace-nowrap"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Subscribing..." : "Subscribe"}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="relative flex items-end justify-center lg:justify-end lg:items-end">
            <Image
              src="/iphone_debutism_hand.png"
              alt="iPhone with Product Hunt newsletter in hand"
              width={400}
              height={600}
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
