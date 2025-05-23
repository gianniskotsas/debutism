import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  Font,
} from '@react-email/components';

const ConfirmationEmail = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Html>
        <Head >
         <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Welcome to debutism - Your subscription is confirmed</Preview>
      <Tailwind>
        <Body className="bg-black font-sans py-[40px] m-0 p-0">
          <Container className="max-w-[600px] mx-auto">
            <Section className="px-[24px] py-[32px] bg-black text-white">
              {/* Header */}
              <Img
                src="https://glhckkdhdbpinqmzpcqs.supabase.co/storage/v1/object/public/thumbnails/debutism/debutism_logo.png"
                width="80"
                height="24"
                alt="debutism logo"
                className="mb-[30px] w-[120px] h-auto object-contain"
              />
              
              {/* Main Content */}
              <Heading className="text-[32px] font-bold mb-[16px] text-white m-0">
                You're subscribed!
              </Heading>
              
              <Text className="text-[16px] leading-[24px] mb-[24px] text-gray-300">
                Thanks for joining debutism. We're excited to have you on board.
              </Text>
              
              <Section className="border-solid border-[1px] border-white rounded-[8px] p-[24px] mb-[32px] bg-gradient-to-b from-gray-900 to-black">
                <Text className="text-[18px] font-medium mb-[16px] text-white">
                  What to expect
                </Text>
                
                <Text className="text-[16px] leading-[24px] mb-[8px] text-gray-300">
                  You'll receive daily emails featuring the most successful Product Hunt launches, 
                  curated specifically for tech early adopters like you.
                </Text>
                
                <Text className="text-[16px] leading-[24px] text-gray-300">
                  Stay ahead of the curve and discover innovative products before they go mainstream.
                </Text>
              </Section>
              
              <Text className="text-[16px] leading-[24px] mb-[32px] text-gray-300">
                Your first issue will arrive in your inbox tomorrow morning.
              </Text>
              
              {/* Footer */}
              <Section className="border-t-[1px] border-solid border-gray-800 pt-[24px] mt-[32px]">
                <Text className="text-[14px] text-gray-500 m-0">
                  © {currentYear} debutism. All rights reserved.
                </Text>
                
                <Text className="text-[14px] mt-[16px]">
                  <Link 
                    href="{{RESEND_UNSUBSCRIBE_URL}}" 
                    className="text-gray-400 underline hover:text-white transition-colors"
                  >
                    Unsubscribe
                  </Link>
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};


export default ConfirmationEmail;